odoo.define('muti_pos_mechanic.OrderlineMechanicButton', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');

    class OrderlineMechanicButton extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.onClick);
        }

        async onClick() {
            this.showPopup('MechanicPopup', {
                title: this.env._t('Select Mechanic'),
                users: this.env.pos.users,
                pos: this.env.pos,
            });

        }
    }
    OrderlineMechanicButton.template = 'OrderlineMechanicButton';

    ProductScreen.addControlButton({
        component: OrderlineMechanicButton,
		condition: function() {
            return True;
        },
          });

    Registries.Component.add(OrderlineMechanicButton);

    return OrderlineMechanicButton;
});
