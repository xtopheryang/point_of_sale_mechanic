odoo.define('muti_pos_mechanic.MechanicPopup', function (require) {
"use strict";

    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { useAutoFocusToLast } = require('point_of_sale.custom_hooks');

    class MechanicPopup extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);            
            useAutoFocusToLast();
        }
        mechanicpopup(event){
            var order = this.props.pos.get_order();
            if (!this.props.orderline) {
                order.get_orderlines().forEach(function (orderline) {
					if (!orderline.get_mechanic()) {
                    	orderline.set_mechanic(event.currentTarget.dataset);
					}
                });
            }
            else{
                this.props.orderline.set_mechanic(event.currentTarget.dataset);
                this.props.orderline.trigger('change',this.props.orderline);
            }
            this.trigger('close-popup');
        }

    }
    MechanicPopup.template = 'MechanicPopup';
    MechanicPopup.defaultProps = {
        confirmText: 'Ok',
        cancelText: 'Cancel',
    };

    Registries.Component.add(MechanicPopup);
    return MechanicPopup;

});
