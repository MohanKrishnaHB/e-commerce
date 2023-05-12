from django.shortcuts import render, redirect
from django.contrib.auth.hashers import check_password
from store.models.customer import Customer
from django.views import View
from store.models.product import Products
from store.models.orders import Order
from store.middlewares.auth import auth_middleware
import json

class OrderView(View):


    def get(self , request ):
        customer = request.session.get('customer')
        orders = Order.get_orders_by_customer(customer)
        print(orders)
        data = {'orders' : orders}
        #Customer Info
        cid = request.session.get('customer')
        if cid:
            customer = Customer.objects.get(id=cid)
            custObj = {
                'email': customer.email,
                'first_name': customer.first_name,
                'last_name': customer.last_name
            }
            data['customer'] = json.dumps(custObj)
            
        return render(request , 'orders.html'  , data)
