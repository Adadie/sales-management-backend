// ./src/api/[api-name]/content-types/[api-name]/lifecycles.js

module.exports = {
  async beforeUpdate(event) {
    /**
        * Find corresponding product
        * Check if size is less or greater
        * If less, create a sale entry
        * If greater create a purchase entry
        * params: {
            where: { id: '1' },
            data: { product_quantity: 434, updatedAt: 2022-09-28T00:46:48.151Z }
        }
    */
    const { data, where, select, populate } = event.params;
    const product = await strapi.db.query("api::product.product").findOne({
      select: ["product_quantity", "product_price", "id"],
      where: where,
    });
        
    console.log("product found---->", product);

    /**
     * Create sale
     */
    if (data.product_quantity < product.product_quantity) {
      let sold_quantity = product.product_quantity - data.product_quantity;
      let total_price = sold_quantity * product.product_price;
      const sale = await strapi.db.query("api::sale.sale").create({
        data: {
          sale_quantity: sold_quantity,
          sale_amount: total_price,
          product: product.id,
        },
      });
      console.log("sale made ---->", sale);
    }

    /**
     * Create purchase
     */
    if (data.product_quantity > product.product_quantity) {
      let purchased_quantity = data.product_quantity - product.product_quantity;
      let total_price = purchased_quantity * product.product_price;
      const purchase = await strapi.db.query("api::purchase.purchase").create({
        data: {
          purchase_quantity: purchased_quantity,
          purchase_amount: total_price,
          product: product.id,
        },
      });
      console.log("purchase made ---->", purchase);
    }
    // let's do a 20% discount everytime
  },
};
