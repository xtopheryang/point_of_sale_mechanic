odoo.define('muti_pos_mechanic.SalesRepPopup', function (require) {
"use strict";

    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { useAutoFocusToLast } = require('point_of_sale.custom_hooks');

    class SalesRepPopup extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);            
            useAutoFocusToLast();
        }
        
        SalesRepPopup(event){
            this.env.pos.get_order().set_sales_rep(event.currentTarget.dataset);
           	var s = this.env.pos.get_order().trigger('change',this.env.pos.get_order);
           	var order = this.env.pos.get_order();
			//alert(order)
			
            this.trigger('close-popup');
        }

    }
    SalesRepPopup.template = 'SalesRepPopup';
    SalesRepPopup.defaultProps = {
        confirmText: 'Ok',
        cancelText: 'Cancel',
    };

    Registries.Component.add(SalesRepPopup);
    return SalesRepPopup;

});
