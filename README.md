# E-commerceWebsite
This project deals with developing a Virtual website ‘E-commerce Website’. It provides the user with a list of the various products available for purchase in the store. For the convenience of online shopping, a shopping cart is provided to the user. After the selection of the goods, it is sent for the order confirmation process. The system is implemented using Python's web framework Django.

1. Clone this repository into a folder on your computer
2. Download Python
3. Open terminal inside the folder with code.
4. Type pip install -r requirements.txt in the terminal window to install all the requirements to run the app.
5. Type python manage.py runserver to start a localhost server for the app.
6. The API is started and now you can use the API routes to give requests.


## To run venv in windows

### 1. Run powershell in unrestricted mode
> Ref: [https://stackoverflow.com/questions/18713086/virtualenv-wont-activate-on-windows](https://stackoverflow.com/questions/18713086/virtualenv-wont-activate-on-windows)

> Set-ExecutionPolicy Unrestricted -Scope Process

[According to Microsoft Tech Support](http://social.technet.microsoft.com/Forums/windowsserver/en-US/964636ad-347e-4b23-8f7a-f36a558115dd/error-file-cannot-be-loaded-because-the-execution-of-scripts-is-disabled-on-this-system) it might be a problem with Execution Policy Settings. To fix it, you should try executing `Set-ExecutionPolicy Unrestricted -Scope Process` (as mentioned in the comment section by @wtsiamruk) in your PowerShell window. This would allow running virtualenv in the current PowerShell session.

There is also another approach that is more unsafe, but recommended by MS Tech Support. This approach would be to use `Set-ExecutionPolicy Unrestricted -Force` (which do unleash powers to screw Your system up). However, before you use this unsafe way, be sure to check what your current ExecutionPolicy setting is by using `get-ExecutionPolicy`. Then, when you are done, you can revert back to this ExecutionPolicy by using `Set-ExecutionPolicy %the value the get-ExecutionPolicy command gave you% -Force`.


### 2. Activate virtual environment
> .\venv\Scripts\activate