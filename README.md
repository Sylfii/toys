# DATABASE VISUALIZATION

## Requirements

Apache2 + Mysql + Php

To install apache2:

```bash
sudo apt-get install apache2
```

To install mysql:

```bash
sudo apt-get install mysql-server mysql-client
```

To install php:

```bash
sudo apt-get install php
```

To link php with apache2(LAMP):

```bash
sudo apt-get install libapache2-mod-php
```

To link php with mysql:

```bash
sudo apt-get install php-mysql
```

## Usage

Download zip or git clone the whole package:

```bash
git clone git@github.com:Sylfii/toys.git
```

Then copy all the files into /var/www/html:

```bash
sudo cp $YOUR_PATH$/toys/* /var/www/html
```

\$YOUR_PATH\$ is where you put the directory 'toys'.

Start apache2 & mysql:

```bash
sudo service apache2 start
sudo service mysql start
```

Then everything is ready.

Use your browser to open localhost/ , and you will see:

![](snapshot/1.png)

Follow the instruction, after upload a csv file:

![](snapshot/2.png)

Tick checkboxes interested, and click button 'Set':

![](snapshot/3.png)

Then it will look like:

![](snapshot/4.png)

Tick checkbox 'Normalize' and click button 'Set' again:

![](snapshot/5.png)

The charts will be normalized:

![](snapshot/6.png)

Click button 'Hide' to hide this panel:

![](snapshot/7.png)

Click button '+' to show this panel:

![](snapshot/8.png)

Click button '^' to scroll back to top:

![](snapshot/9.png)

Select the filter condition:

![](snapshot/10.png)

Then Click button 'Filter':

![](snapshot/11.png)

It works:

![](snapshot/12.png)

Of course you can click 'Filter' without condition to reset.

At last, you can click '^' and back to top to upload another csv file.

![](snapshot/13.png)

That's all, thanks XD.