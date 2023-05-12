from django.shortcuts import render , redirect

from django.contrib.auth.hashers import  check_password
from store.models.customer import Customer
from django.views import  View
from store.models.product import Products
import json

class Cart(View):
    def get(self , request):
        ids = list(request.session.get('cart').keys())
        products = Products.get_products_by_id(ids)
        print(products)
        data = {'products' : products}
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
            
        return render(request , 'cart.html' ,  data)

