export default {
  name: 'qrcode',
  description: '二维码生成器',

  test(code, language) {
    return language === 'qrcode';
  },

  render(code, container) {
    container.innerHTML = '';
    container.className = 'qrcode-container';
    container.style.margin = '1.5em 0';
    container.style.padding = '1.5em';
    container.style.background = 'var(--color-surface)';
    container.style.borderRadius = '12px';
    container.style.border = '1px solid var(--color-border)';
    container.style.textAlign = 'center';

    let data = code.trim();
    let size = 256;

    try {
      const parsed = JSON.parse(code);
      data = parsed.data || code;
      size = parsed.size || 256;
    } catch (e) {
    }

    const img = document.createElement('img');
    img.src = this.generateQRCodeUrl(data, size);
    img.alt = 'QR Code';
    img.style.display = 'inline-block';
    img.style.margin = '0 auto';
    img.style.maxWidth = '100%';
    img.style.borderRadius = '8px';

    img.onerror = () => {
      img.style.display = 'none';
      const errorDiv = document.createElement('div');
      errorDiv.style.color = '#ff6b6b';
      errorDiv.style.padding = '20px';
      errorDiv.textContent = '二维码生成失败';
      container.appendChild(errorDiv);
    };

    container.appendChild(img);

    const textDiv = document.createElement('div');
    textDiv.style.marginTop = '1em';
    textDiv.style.color = 'var(--color-text-secondary)';
    textDiv.style.fontSize = '0.875em';
    textDiv.textContent = data.length > 100 ? data.substring(0, 97) + '...' : data;
    container.appendChild(textDiv);
  },

  generateQRCodeUrl(data, size) {
    const encodedData = encodeURIComponent(data);
    const level = 'L';
    return `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodedData}&choe=UTF-8&chld=${level}|0`;
  }
};
