odoo.define('muti_pos_mechanic.PaymentScreenMuti', function(require) {
    'use strict';

    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const Registries = require('point_of_sale.Registries');

    const PaymentScreenMuti = PaymentScreen =>
        class extends PaymentScreen {
			async _isOrderValid(isForceValidate) {
			//var order = this.env.pos.get_order();
			var is_labor = 0
            this.currentOrder.get_orderlines().forEach(function (orderline) {
				if (orderline.product.type == 'service') {
	                if (!orderline.get_mechanic()) {
						is_labor = 1
                    	
					}
				
				}
            });
            if (is_labor == 1) {
				this.showPopup('ErrorPopup', {
                    title: this.env._t('Order cannot be confirmed'),
                    body: this.env._t(
                        'Please select a mechanic for this order.'
                    ),
                });
			}
            if (this.currentOrder.get_orderlines().length === 0) {
                this.showPopup('ErrorPopup', {
                    title: this.env._t('Empty Order'),
                    body: this.env._t(
                        'There must be at least one product in your order before it can be validated'
                    ),
                });
                return false;
            }

            if (this.currentOrder.is_to_invoice() && !this.currentOrder.get_client()) {
                const { confirmed } = await this.showPopup('ErrorPopup', {
                    title: this.env._t('Please select the Customer'),
                    body: this.env._t(
                        'You need to select the customer before you can invoice an order.'
                    ),
                });
                if (confirmed) {
                    this.selectClient();
                }
                return false;
            }

            if (!this.currentOrder.is_paid() || this.invoicing) {
                return false;
            }

            if (this.currentOrder.has_not_valid_rounding()) {
                var line = this.currentOrder.has_not_valid_rounding();
                this.showPopup('ErrorPopup', {
                    title: this.env._t('Incorrect rounding'),
                    body: this.env._t(
                        'You have to round your payments lines.' + line.amount + ' is not rounded.'
                    ),
                });
                return false;
            }

            // The exact amount must be paid if there is no cash payment method defined.
            if (
                Math.abs(
                    this.currentOrder.get_total_with_tax() - this.currentOrder.get_total_paid()  + this.currentOrder.get_rounding_applied()
                ) > 0.00001
            ) {
                var cash = false;
                for (var i = 0; i < this.env.pos.payment_methods.length; i++) {
                    cash = cash || this.env.pos.payment_methods[i].is_cash_count;
                }
                if (!cash) {
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Cannot return change without a cash payment method'),
                        body: this.env._t(
                            'There is no cash payment method available in this point of sale to handle the change.\n\n Please pay the exact amount or add a cash payment method in the point of sale configuration'
                        ),
                    });
                    return false;
                }
            }

            // if the change is too large, it's probably an input error, make the user confirm.
            if (
                !isForceValidate &&
                this.currentOrder.get_total_with_tax() > 0 &&
                this.currentOrder.get_total_with_tax() * 1000 < this.currentOrder.get_total_paid()
            ) {
                this.showPopup('ConfirmPopup', {
                    title: this.env._t('Please Confirm Large Amount'),
                    body:
                        this.env._t('Are you sure that the customer wants to  pay') +
                        ' ' +
                        this.env.pos.format_currency(this.currentOrder.get_total_paid()) +
                        ' ' +
                        this.env._t('for an order of') +
                        ' ' +
                        this.env.pos.format_currency(this.currentOrder.get_total_with_tax()) +
                        ' ' +
                        this.env._t('? Clicking "Confirm" will validate the payment.'),
                }).then(({ confirmed }) => {
                    if (confirmed) this.validateOrder(true);
                });
                return false;
            }

            return true;
        }
            usericonclick(){
                this.showPopup('MechanicPopup',{
                    title: this.env._t('Select Mechanic'),
                    users: this.env.pos.users,
                    pos: this.env.pos,
                    orderline: this.props.line,
                });
           }
        };

    Registries.Component.extend(PaymentScreen, PaymentScreenMuti);

    return PaymentScreen;
});
