# -*- coding: utf-8 -*-

from odoo import api, fields, models, _
from datetime import timedelta, date
import datetime
import math
import logging
from odoo.exceptions import UserError, ValidationError

_logger = logging.getLogger(__name__)


class PosMechanicIncentiveLines(models.Model):
    _name = 'pos.mechanic.incentive.lines'

    report_id = fields.Many2one('pos.mechanic.incentive','Incentive')
    date_order = fields.Date('Date')
    reference = fields.Char('Ref #')
    service_name = fields.Char('Labor')
    amount = fields.Float('Amount')
    commission = fields.Float('Commission')

class PosMechanicIncentive(models.Model):
    _name = 'pos.mechanic.incentive'
    
    user_id = fields.Many2one('res.users','User')
    date_from = fields.Date('Date From',default=fields.Date.context_today)
    date_to = fields.Date('Date to', default=fields.Date.context_today)
    incentive_ids = fields.One2many('pos.mechanic.incentive.lines','report_id','Commission')
    total_amount = fields.Float('Total Amount')
    total_commission = fields.Float('Total Commission')
    name = fields.Char('Name')
    incentive = fields.Float('Incentive %',default=lambda self: self.env['pos.config'].search([],limit=1).incentive)
    
    def generate_report(self):
        line_ids = []
        pos_orders = self.env['pos.order'].search([('state','in',['paid','done','invoiced'])])
        total_amount =  0
        total_commission = 0
        for pos in pos_orders:
            if pos.date_order.date() >= self.date_from and pos.date_order.date() <= self.date_to:
                for line in pos.lines:
                    if line.mechanic_id == self.user_id:
                        incentive = self.incentive / 100
                        commission_line = self.env['pos.mechanic.incentive.lines'].create({'date_order' : pos.date_order,
                                           'reference' : pos.name,
                                           'service_name' : line.full_product_name,
                                           'amount' : line.price_subtotal,
                                           'commission' : line.price_subtotal * incentive 
                                           })
                        total_amount += line.price_subtotal
                        total_commission += (line.price_subtotal * incentive)
                        line_ids.append(commission_line.id)
        self.incentive_ids = [(6,0,line_ids)]
        self.total_amount = total_amount
        self.total_commission = total_commission
        self.name = self.user_id.name + '- Incentive' 
        return self.env.ref('point_of_sale_mechanic.point_of_sale_mechanic_incentive_report').report_action(self)