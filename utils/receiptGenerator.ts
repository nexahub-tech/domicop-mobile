import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { formatCurrencyNoSign } from '../data/mockData';
import { Transaction } from '../data/mockData';

// Logo path (will be converted to base64 for PDF)
const LOGO_PATH = require('../assets/images/logos/domicop-logo.png');

export const generateReceiptHTML = (transaction: Transaction): string => {
  const amount = formatCurrencyNoSign(Math.abs(transaction.amount));
  const isContribution = transaction.amount > 0;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            background: #ffffff;
            padding: 40px;
            color: #0f172a;
          }
          
          .receipt {
            max-width: 600px;
            margin: 0 auto;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #0b50da 0%, #003cad 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          
          .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 16px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
            color: #0b50da;
          }
          
          .company-name {
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 4px;
          }
          
          .receipt-title {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 500;
          }
          
          .amount-section {
            background: #f8fafc;
            padding: 40px 30px;
            text-align: center;
            border-bottom: 2px dashed #e2e8f0;
          }
          
          .amount-label {
            font-size: 14px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-weight: 600;
          }
          
          .amount-value {
            font-size: 48px;
            font-weight: 800;
            color: ${isContribution ? '#0b50da' : '#ef4444'};
            margin-bottom: 16px;
          }
          
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            background: ${transaction.status === 'completed' ? '#dcfce7' : transaction.status === 'pending' ? '#fef3c7' : '#fee2e2'};
            color: ${transaction.status === 'completed' ? '#166534' : transaction.status === 'pending' ? '#92400e' : '#991b1b'};
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .details {
            padding: 30px;
          }
          
          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid #f1f5f9;
          }
          
          .detail-row:last-child {
            border-bottom: none;
          }
          
          .detail-label {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
          }
          
          .detail-value {
            font-size: 14px;
            color: #0f172a;
            font-weight: 600;
          }
          
          .footer {
            background: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            border-top: 2px solid #e2e8f0;
          }
          
          .disclaimer {
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.5;
            margin-bottom: 16px;
          }
          
          .generated-date {
            font-size: 12px;
            color: #64748b;
          }
          
          .qr-placeholder {
            width: 100px;
            height: 100px;
            margin: 20px auto;
            background: #f1f5f9;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">D</div>
            <div class="company-name">DOMICOP</div>
            <div class="receipt-title">Contribution Receipt</div>
          </div>
          
          <div class="amount-section">
            <div class="amount-label">${isContribution ? 'Contribution Amount' : 'Withdrawal Amount'}</div>
            <div class="amount-value">₦${amount}</div>
            <div class="status-badge">${transaction.status.toUpperCase()}</div>
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Transaction ID</span>
              <span class="detail-value">${transaction.id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">${transaction.date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time</span>
              <span class="detail-value">${transaction.time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Description</span>
              <span class="detail-value">${transaction.title}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Type</span>
              <span class="detail-value">${transaction.type.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Category</span>
              <span class="detail-value">${transaction.category.toUpperCase()}</span>
            </div>
          </div>
          
          <div class="footer">
            <p class="disclaimer">
              This receipt was generated electronically and is valid without signature. 
              All contributions are processed through the DOMICOP Cooperative ledger and are non-reversible once confirmed. 
              Please retain this receipt for your records.
            </p>
            <p class="generated-date">
              Generated on ${new Date().toLocaleDateString('en-NG', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const generateReceipt = async (transaction: Transaction): Promise<string> => {
  try {
    const html = generateReceiptHTML(transaction);
    
    // Generate PDF from HTML
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });
    
    // Create receipt filename
    const receiptName = `DOMICOP-Receipt-${transaction.id}.pdf`;
    const newUri = (FileSystem as any).documentDirectory + receiptName;
    
    // Move file to permanent location
    await (FileSystem as any).moveAsync({
      from: uri,
      to: newUri,
    });
    
    return newUri;
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw new Error('Failed to generate receipt');
  }
};

export const shareReceipt = async (receiptUri: string) => {
  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(receiptUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Receipt',
        UTI: 'com.adobe.pdf',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error sharing receipt:', error);
    throw error;
  }
};

export const downloadReceipt = async (transaction: Transaction): Promise<string> => {
  const receiptUri = await generateReceipt(transaction);
  return receiptUri;
};
