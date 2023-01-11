function bilangan(value) {
  if (value % 2 === 0) {
    return `${value} adalah bilangan genap `;
  } else {
    return `${value} adalah bilangan ganjil `;
  }
}

const smk = "SMP AL-WAFA";

module.exports = { smk, bilangan };
