from django.shortcuts import render , redirect , HttpResponseRedirect
from store.models.product import Products
from store.models.category import Category
from store.models.customer import Customer
from django.views import View
import json

# Create your views here.
class Index(View):
    def post(self , request):
        product = request.POST.get('product')
        remove = request.POST.get('remove')
        cart = request.session.get('cart')
        if cart:
            quantity = cart.get(product)
            if quantity:
                if remove:
                    if quantity<=1:
                        cart.pop(product)
                    else:
                        cart[product]  = quantity-1
                else:
                    cart[product]  = quantity+1

            else:
                cart[product] = 1
        else:
            cart = {}
            cart[product] = 1

        request.session['cart'] = cart
        print('cart' , request.session['cart'])
        return redirect('homepage')



    def get(self , request):
        # print()
        return HttpResponseRedirect(f'/store{request.get_full_path()[1:]}')


def store(request):

    # Products to file Start
    # f = open("products.csv", "w")
    # products = Products.get_all_products();
    # f.write("id,name,price,category,description,image")
    # for p in products:
    #     f.write("\n" + str(p.id) + "," + str(p.name) + "," + str(p.price) + "," + str(p.category) + "," + str(p.description) + "," + str(p.image.url))
    # f.close()
    # Products to file End

    cart = request.session.get('cart')
    if not cart:
        request.session['cart'] = {}
    products = None
    categories = Category.get_all_categories()
    categoryID = request.GET.get('category')
    data = {}
    if categoryID:
        products = Products.get_all_products_by_categoryid(categoryID)
        selectedCategory = products[0].category
        data['selectedCategory'] = selectedCategory
        data['categoryId'] = products[0].category.id
    else:
        products = Products.get_all_products();

    # data = {}
    data['products'] = products
    data['categories'] = categories
    print('you are : ', request.session.get('email'))
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
    
    return render(request, 'index.html', data)


def viewProducts(request, pid):
    product = None
    product = Products.get_products_by_id([pid])
    data = {}
    data['product'] = product[0]
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
        
    return render(request, 'view-product.html', data)