// Todo: Implement increasing and decreasing of items from cart page
// Todo: Removal of a product from cart

module.exports = function Shopping(shoppingItems) {
    this.items = shoppingItems.items || {};
    this.totalQty = shoppingItems.totalQty || 0;
    this.totalPrice = shoppingItems.totalPrice || 0;

    this.add = function(item, id) {
        var haveItem = this.items[id];
        if (!haveItem) {
            haveItem = this.items[id] = {item: item, qty: 0, price: 0, id: id};
        }
        haveItem.qty++;
        haveItem.price = haveItem.item.price * haveItem.qty;
        this.totalQty++;
        this.totalPrice += haveItem.item.price;
    };

    this.shoppingArr = function() {
        var shoppingList = [];
        for (var id in this.items) {
            shoppingList.push(this.items[id]);
        }
        //console.log(shoppingList);
        return shoppingList;
    };

    this.decrement = function (item, id) {
        var haveItem = this.items[id];
        if (!haveItem) {
            haveItem = this.items[id] = {item: item, qty: 0, price: 0, id: id};
        }
        haveItem.qty--;
        haveItem.price = haveItem.item.price * haveItem.qty;
        this.totalQty--;
        this.totalPrice -= haveItem.item.price;

        if(haveItem.qty < 1){ // zero or negative, basic check for zero but covering negative is extra safety
            delete this.items[id];
        }


    };

    this.increment = function (item, id) {
        var haveItem = this.items[id];
        if (!haveItem) {
            haveItem = this.items[id] = {item: item, qty: 0, price: 0, id: id};
        }
        haveItem.qty++;
        haveItem.price = haveItem.item.price * haveItem.qty;
        this.totalQty++;
        this.totalPrice += haveItem.item.price;


    };

    this.remove = function (item, id) {
        var haveItem = this.items[id];
        if (!haveItem) {
            return;
        }
        //haveItem.price = haveItem.item.price * haveItem.qty;
        this.totalQty -= haveItem.qty;
        this.totalPrice -= haveItem.price;

        delete this.items[id];
    };
};
