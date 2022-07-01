# -*- coding: utf-8 -*-

from odoo import api, fields, models


class PosOrder(models.Model):
	_inherit = "pos.order"

	mechanic_id = fields.Many2one('res.users', string='Mechanic',
										help='Mechanic who selected in pos')
	sales_rep_id = fields.Many2one('res.users', string='Sales Representative')


	@api.model
	def _order_fields(self, ui_order):
		res = super(PosOrder, self)._order_fields(ui_order)  
		res['sales_rep_id'] = ui_order['sales_rep_id']
		return res

class PosOrderLine(models.Model):
	_inherit = "pos.order.line"

	mechanic_id = fields.Many2one('res.users', string='Mechanic',
										help='Mechanic who selected in pos')
	incentive = fields.Float('Incentive %',default=lambda self: self.session_id.config_id.incentive if self.mechanic_id else 0)
