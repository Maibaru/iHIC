const fs = require('fs');
const csv = require('csv-parser');

// Template for individual item pages
const itemTemplate = (data) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>i-HIC - ${data['Item Name']} Details</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 15px; background-color: #f5f5f5; font-family: Arial, sans-serif; }
        .container { max-width: 100%; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .header { font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif; color: #0066cc; text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 25px; }
        .item-name { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 30px; color: #333; }
        .detail-row { display: flex; flex-wrap: wrap; margin-bottom: 10px; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; width: 40%; color: #7f8c8d; }
        .detail-value { width: 60%; word-break: break-word; }
        .cert-available { color: #27ae60; font-weight: bold; }
        .cert-not-available { color: #e74c3c; font-weight: bold; }
        .expired { color: #e74c3c; font-weight: bold; }
        .valid { color: #27ae60; font-weight: bold; }
        .btn { display: inline-block; padding: 10px 15px; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px; text-align: center; font-size: 14px; border: none; cursor: pointer; width: 100%; }
        .btn:hover { opacity: 0.9; }
        .btn-green { background-color: #2ecc71; }
        .btn-purple { background-color: #9b59b6; }
        .btn-blue { background-color: #3498db; }
        .stock-request-box { background-color: #f2f2f2; padding: 15px; border-radius: 5px; margin-top: 20px; }
        .quantity-input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
        .quantity-label { display: block; margin: 10px 0 5px; font-weight: bold; color: #333; }
        .back-btn { display: block; text-align: center; margin-top: 20px; color: #3498db; text-decoration: none; font-weight: bold; }
        @media (min-width: 600px) { .container { max-width: 500px; } .header { font-size: 24px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Instant Halal & Inventory Checker (i-HIC)</div>
        <div class="item-name">${data['Item Name']}</div>
        
        <div class="detail-row">
            <div class="detail-label">Item ID:</div>
            <div class="detail-value">${data['Item ID']}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Item Name:</div>
            <div class="detail-value">${data['Item Name']}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Category:</div>
            <div class="detail-value">${data['Category']}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Brand:</div>
            <div class="detail-value">${data['Brand']}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Supplier:</div>
            <div class="detail-value">${data['Supplier']}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Purchased Date:</div>
            <div class="detail-value">${data['Purchased Date']}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Invoice:</div>
            <div class="detail-value">
                ${data['Invoice'] === 'NA' ? 'NA' : `<a href="${data['Invoice']}" class="btn btn-blue">View Invoice</a>`}
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Halal Certificate:</div>
            <div class="detail-value">
                ${data['Halal Certificate'] === 'NA' ? 'NA' : `<a href="${data['Halal Certificate']}" class="btn btn-blue">View Certificate</a>`}
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Certificate Expiry Date:</div>
            <div class="detail-value">
                <span class="${data['Certificate Expiry Date'] === 'NA' ? '' : (data['Certificate Expired in (Day)'] === '#NUM!' ? 'expired' : 'valid')}">
                ${data['Certificate Expiry Date']}${data['Certificate Expiry Date'] === 'NA' ? '' : ` (${data['Certificate Expired in (Day)'] === '#NUM!' ? 'Expired' : 'Valid'})`}
                </span>
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Stock Available:</div>
            <div class="detail-value">${data['Stock Available']}</div>
        </div>
        
        <div class="stock-request-box">
            <button class="btn btn-green">Stock Request</button>
            <label class="quantity-label">Quantity:</label>
            <input type="text" class="quantity-input" placeholder="Enter quantity">
            <button class="btn btn-purple" onclick="sendRequest('${data['Item Name']}')">Send Request</button>
        </div>
        
        <a href="index.html" class="back-btn">← Back</a>
    </div>

    <script>
        function sendRequest(itemName) {
            const quantityInput = document.querySelector('.quantity-input');
            const quantity = quantityInput.value;
            
            if (!quantity) {
                alert('Please enter a quantity');
                return;
            }
            
            const subject = \`Stock Request - \${itemName}\`;
            const body = \`Hi. I want to request for \${itemName} with a quantity of \${quantity}. Thank you.\`;
            
            window.location.href = \`mailto:mygml021@gmail.com?subject=\${encodeURIComponent(subject)}&body=\${encodeURIComponent(body)}\`;
            quantityInput.value = '';
        }
    </script>
</body>
</html>`;

// Process CSV and generate HTML files
fs.createReadStream('Halal Info 2.csv')
  .pipe(csv())
  .on('data', (row) => {
    const filename = `item_id${row['Item ID']}.html`;
    fs.writeFileSync(filename, itemTemplate(row));
    console.log(`Generated: ${filename}`);
  })
  .on('end', () => {
    console.log('All item pages generated successfully');
    generateIndexMain();
  });

// Generate index_main.html
function generateIndexMain() {
  const results = [];
  fs.createReadStream('Halal Info 2.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>i-HIC - Inventory List</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 15px; background-color: #f5f5f5; font-family: Arial, sans-serif; }
        .header { font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif; color: #0066cc; text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 25px; }
        .item-list { max-width: 100%; margin: 0 auto; }
        .item-card { background: white; border-radius: 10px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .item-name { font-size: 18px; font-weight: bold; color: #2c3e50; margin-bottom: 5px; }
        .item-details { display: flex; flex-wrap: wrap; margin-bottom: 5px; }
        .item-label { font-weight: bold; width: 120px; color: #7f8c8d; }
        .item-value { flex: 1; }
        .view-btn { display: block; text-align: center; padding: 8px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px; }
        .cert-available { color: #27ae60; font-weight: bold; }
        .cert-not-available { color: #e74c3c; font-weight: bold; }
        .logout-btn { display: block; text-align: center; margin-top: 20px; color: #3498db; text-decoration: none; font-weight: bold; }
        @media (min-width: 600px) { .item-list { max-width: 500px; } .header { font-size: 24px; } }
    </style>
</head>
<body>
    <div class="header">Instant Halal & Inventory Checker (i-HIC)</div>
    <div class="item-list">
        ${results.map(item => `
        <div class="item-card">
            <div class="item-name">${item['Item Name']}</div>
            <div class="item-details">
                <div class="item-label">Item ID:</div>
                <div class="item-value">${item['Item ID']}</div>
            </div>
            <div class="item-details">
                <div class="item-label">Category:</div>
                <div class="item-value">${item['Category']}</div>
            </div>
            <div class="item-details">
                <div class="item-label">Stock:</div>
                <div class="item-value">${item['Stock Available']}</div>
            </div>
            <div class="item-details">
                <div class="item-label">Halal Status:</div>
                <div class="item-value ${item['Halal Certificate'] === 'NA' ? 'cert-not-available' : 'cert-available'}">
                    ${item['Halal Certificate'] === 'NA' ? 'Not Available' : 'Available'}${item['Certificate Expiry Date'] !== 'NA' && item['Certificate Expired in (Day)'] === '#NUM!' ? ' (Expired)' : ''}
                </div>
            </div>
            <a href="item_id${item['Item ID']}.html" class="view-btn">View Details</a>
        </div>
        `).join('')}
    </div>
    <a href="index.html" class="logout-btn">← Back</a>
</body>
</html>`;

      fs.writeFileSync('index_main.html', indexContent);
      console.log('Generated: index_main.html');
    });
}