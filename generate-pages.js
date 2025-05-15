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
        /* ... (keep all other CSS the same) ... */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Instant Halal & Inventory Checker (i-HIC)</div>
        <!-- ... (rest of the template remains the same) ... -->
    </div>
    <!-- ... (keep scripts the same) ... -->
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
        /* ... (keep all CSS the same) ... */
    </style>
</head>
<body>
    <div class="header">Instant Halal & Inventory Checker (i-HIC)</div>
    <!-- ... (rest of the index content remains the same) ... -->
</body>
</html>`;

      fs.writeFileSync('index_main.html', indexContent);
      console.log('Generated: index_main.html');
    });
}