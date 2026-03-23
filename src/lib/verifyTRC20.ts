// TRC20 (USDT) Transaction Verification Engine
// Uses TronScan API — no API key required

const TRON_USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT TRC20 contract
const TRONSCAN_API = 'https://apilist.tronscan.org/api';

export interface VerificationResult {
  success: boolean;
  error?: string;
  txData?: {
    amount: number;
    toAddress: string;
    confirmations: number;
    timestamp: number;
    contractAddress: string;
  };
}

// Sleep utility for retry delays
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Validate TXID format (64 hex chars)
export function isValidTxid(txid: string): boolean {
  return /^[a-fA-F0-9]{64}$/.test(txid.trim());
}

// Decode TRC20 transfer from contract data
function decodeTRC20Transfer(contractData: any): { to: string; amount: number } | null {
  try {
    // TRC20 transfers go through TriggerSmartContract
    if (contractData?.contractType !== 31) return null;

    const rawData = contractData?.contractData;
    if (!rawData) return null;

    // Amount is in sun (1 USDT = 10^6 sun for TRC20 with 6 decimals)
    const amount = rawData.data
      ? parseInt(rawData.data.slice(-64), 16) / 1_000_000
      : 0;

    // Decode recipient from data field (3rd param in ERC20/TRC20 transfer ABI)
    const toAddressHex = rawData.data
      ? '41' + rawData.data.slice(32, 72)
      : '';

    return { to: toAddressHex, amount };
  } catch {
    return null;
  }
}

// Main verification function — retries up to 3 times
export async function verifyTRC20Transaction(
  txid: string,
  expectedAmount: number,
  systemWallet: string,
  retries = 3
): Promise<VerificationResult> {

  if (!isValidTxid(txid)) {
    return { success: false, error: 'Formato de TXID inválido. Debe ser 64 caracteres hexadecimales.' };
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Primary API: TronScan transaction-info
      const response = await fetch(
        `${TRONSCAN_API}/transaction-info?hash=${txid.trim()}`,
        { 
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000)
        }
      );

      if (!response.ok) {
        if (attempt < retries) { await sleep(2000 * attempt); continue; }
        return { success: false, error: 'API de blockchain no disponible. Intenta en unos minutos.' };
      }

      const data = await response.json();

      // Transaction not found yet
      if (!data || !data.hash) {
        return { success: false, error: 'TXID no encontrado. Puede tardar 1-2 minutos en aparecer. Intenta de nuevo.' };
      }

      // Check if transaction succeeded
      if (data.contractRet !== 'SUCCESS' && data.contractRet !== undefined) {
        return { success: false, error: 'La transacción falló en la blockchain.' };
      }

      // Extract TRC20 transfer details from trc20TransferInfo
      const transferInfo = data.trc20TransferInfo?.[0];
      if (!transferInfo) {
        return { success: false, error: 'Esta transacción no es una transferencia TRC20 de USDT.' };
      }

      // Validate contract (must be USDT)
      if (transferInfo.contract_address?.toLowerCase() !== TRON_USDT_CONTRACT.toLowerCase()) {
        return { success: false, error: 'Solo se acepta USDT (TRC20). La transacción usa un token diferente.' };
      }

      // Parse amount (TRC20 USDT has 6 decimals)
      const actualAmount = parseInt(transferInfo.amount_str || '0') / 1_000_000;
      const toAddress = transferInfo.to_address || '';
      const confirmations = data.confirmed ? 1 : 0;

      // Validate destination wallet  
      if (toAddress.toLowerCase() !== systemWallet.toLowerCase()) {
        return { 
          success: false, 
          error: `Dirección de destino incorrecta. La transacción fue enviada a ${toAddress.slice(0, 10)}...`
        };
      }

      // Validate amount (allow 0.5% tolerance for fees)
      const tolerance = expectedAmount * 0.005;
      if (Math.abs(actualAmount - expectedAmount) > tolerance) {
        return { 
          success: false, 
          error: `Monto incorrecto. Enviaste ${actualAmount} USDT, se esperaba ${expectedAmount} USDT.`
        };
      }

      // Validate confirmations
      if (!data.confirmed) {
        return { 
          success: false, 
          error: 'La transacción aún no tiene confirmaciones. Espera 1-2 minutos y reintenta.'
        };
      }

      return {
        success: true,
        txData: {
          amount: actualAmount,
          toAddress,
          confirmations: confirmations,
          timestamp: data.timestamp || Date.now(),
          contractAddress: transferInfo.contract_address,
        }
      };

    } catch (err: any) {
      if (attempt < retries) {
        await sleep(2000 * attempt);
        continue;
      }
      return { 
        success: false, 
        error: `Error al conectar con la blockchain (intento ${attempt}/${retries}). Verifica tu conexión.`
      };
    }
  }

  return { success: false, error: 'Verificación fallida después de múltiples intentos.' };
}
