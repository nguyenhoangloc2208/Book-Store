const bestSelling = (data) => {
    const filteredData = data.filter(product => product.sold_count > 0);
    return filteredData.sort((a, b) => b.sold_count - a.sold_count);
};

const sortAZ = (data) => {
    return [...data].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
    });
};

const sortZA = (data) => {
    return [...data].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA > nameB) {
        return -1;
    }
    if (nameA < nameB) {
        return 1;
    }
    return 0;
    });
};

const sortPriceMinToMax = (data) => {
    return [...data].sort((a, b) => {
    const priceA = a.final_price;
    const priceB = b.final_price;
        return priceA - priceB;
    });
};

const sortPriceMaxToMin = (data) => {
    return [...data].sort((a, b) => {
    const priceA = a.final_price;
    const priceB = b.final_price;
        return priceB - priceA;
    });
};

const sortCreatedAtNew = (products) => {
    return [...products].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
        return dateA - dateB;
    });
  };

  const sortCreatedAtOld = (products) => {
    return [...products].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
        return dateB - dateA;
    });
  };

const Sort = {
    bestSelling,
    sortAZ,
    sortZA,
    sortPriceMaxToMin,
    sortPriceMinToMax,
    sortCreatedAtNew,
    sortCreatedAtOld
}

export default Sort;