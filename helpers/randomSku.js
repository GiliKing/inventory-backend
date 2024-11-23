function generateRandomSKU(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Characters for SKU
  let sku = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    sku += characters[randomIndex];
  }
  return sku;
}

const randomSKU = generateRandomSKU();

export default randomSKU;
  