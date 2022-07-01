# -*- coding: utf-8 -*-

from odoo import fields, models

class PosConfig(models.Model):
    _inherit = 'pos.config'

    incentive = fields.Float('Incentive %',default="10")