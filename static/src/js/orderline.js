odoo.define('muti_pos_mechanic.orderline', function(require) {
    'use strict';

    const Orderline = require('point_of_sale.Orderline');
    const Registries = require('point_of_sale.Registries');

    const PosResOrderline = Orderline =>
        class extends Orderline {
            usericonclick(){
                this.showPopup('MechanicPopup',{
                    title: this.env._t('Select Mechanic'),
                    users: this.env.pos.users,
                    pos: this.env.pos,
                    orderline: this.props.line,
                });
           }
        };

    Registries.Component.extend(Orderline, PosResOrderline);

    return Orderline;
});
