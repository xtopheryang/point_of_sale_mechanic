# -*- coding: utf-8 -*-
{
    'name': "POS Mechanic",
    'summary': "POS Mechanic",
    'description': "Added Mechanic Field in POS Screen, required input if at least 1 product in POS is Service type",
    'author': "Christopher Yang",
    'website': "https://www.achievewithoutborders.com/",
    'category': 'Custom',
    'version': '0.1',
    'depends': ['point_of_sale'],
    'data': [
        'security/ir.model.access.csv',
        'views/pos_template.xml',
        'views/pos_order_views.xml',
        'views/pos_config_views.xml',
        'views/pos_mechanic_incentive_views.xml',
        'reports/pos_mechanic_incentive_template.xml'
    ],
    'qweb': [
        'static/src/xml/mechanic_popup.xml',
        'static/src/xml/salesrep_popup.xml',
        'static/src/xml/mechanic.xml',
        
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
}
