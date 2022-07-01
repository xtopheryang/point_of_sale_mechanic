odoo.define('muti_pos_mechanic.modelsorderline', function (require) {
"use strict";

    var models = require('point_of_sale.models');
    models.load_fields('product.product','type');
    models.load_fields('pos.order','[sales_rep_id]');
    var _super_orderline = models.Orderline.prototype;
    var _super_order = models.Order.prototype;
    var _super_pos = models.PosModel.prototype;
    var exports = {};
	
	models.PosModel = models.PosModel.extend({
        initialize: function(session, attributes){
            var self = this;
             models.load_fields('pos.order',['sales_rep_id']);
            _super_pos.initialize.apply(this, arguments);
        }
    });

	models.Order = models.Order.extend({
		initialize: function(attr, options) {
			this.mechanic = this.mechanic 
            this.mechanic_id = this.mechanic_id 
            this.sales_rep = this.sales_rep
            this.sales_rep_id = this.sales_rep_id
            _super_order.initialize.call(this,attr,options);
        },
        set_mechanic: function(mechanic){
			var order = this.env.pos.get_order();
            order.get_orderlines().forEach(function (orderline) {
				if (orderline.product.type == 'service') {
					return orderline.set_mechanic()
				
				}
            });
        },
        get_mechanic: function(mechanic){
            var order = this.env.pos.get_order();
            order.get_orderlines().forEach(function (orderline) {
				if (orderline.product.type == 'service') {
					return orderline.get_mechanic()
				
				}
            });
        },
        set_sales_rep: function(sales_rep){
            this.sales_rep = sales_rep.value;
            this.sales_rep_id = sales_rep.id;
            this.trigger('change',this);
        	this.assert_editable();
        	this.set('sales_rep',this.sales_rep);
        	this.set('sales_rep_id',this.sales_rep_id);
        },
        get_sales_rep: function(sales_rep){
            return this.sales_rep;
        },
        can_be_merged_with: function(order) {
            if (order.get_sales_rep() !== this.get_sales_rep()) {
                return false;
            } else {
                return _super_order.can_be_merged_with.apply(this,arguments);
            }
        },
        clone: function(){
            var order = _super_order.clone.call(this);
            order.sales_rep = this.sales_rep;
            order.sales_rep_id = this.sales_rep_id;
            return order;
        },
        export_as_JSON: function(){
            var json = _super_order.export_as_JSON.call(this);
            json.sales_rep = this.sales_rep;
            json.sales_rep_id = this.sales_rep_id;
            return json;
        },
        init_from_JSON: function(json){
			this.sales_rep = json.sales_rep;
            this.sales_rep_id = json.sales_rep_id;
            _super_order.init_from_JSON.apply(this,arguments);
            
        },
		});
	
    models.Orderline = models.Orderline.extend({
        initialize: function(attr, options) {
            _super_orderline.initialize.call(this,attr,options);
            this.mechanic = this.mechanic || "";
            this.mechanic_id = this.mechanic_id || 0.0;
        },
        set_mechanic: function(mechanic){
            this.mechanic = mechanic.value;
            this.mechanic_id = mechanic.id;
            this.trigger('change',this);
        },
        get_mechanic: function(mechanic){
            return this.mechanic;
        },
        can_be_merged_with: function(orderline) {
            if (orderline.get_mechanic() !== this.get_mechanic()) {
                return false;
            } else {
                return _super_orderline.can_be_merged_with.apply(this,arguments);
            }
        },
        clone: function(){
            var orderline = _super_orderline.clone.call(this);
            orderline.mechanic = this.mechanic;
            orderline.mechanic_id = this.mechanic_id;
            return orderline;
        },
        export_as_JSON: function(){
            var json = _super_orderline.export_as_JSON.call(this);
            json.mechanic = this.mechanic;
            json.mechanic_id = this.mechanic_id;
            return json;
        },
        init_from_JSON: function(json){
            _super_orderline.init_from_JSON.apply(this,arguments);
            this.mechanic = json.mechanic;
            this.mechanic_id = json.mechanic_id;
        },
    });

});
