---
kind: article
date: 2009-12-27
title: Customising Magento controllers
description: How to customise a Magento controller using Magento 1.4
tags:
- magento
- php
aliases:
- /articles/customising-magento-controllers/
---

How to customize a Magento controller. This follows from another note about
[creating a simple Magento module](/posts/creating-a-custom-magento-module/).

## Code structure

We start by copying the core 'AccountController.php' file to our already
existing module. To keep things simpler will we reuse the module we created in
the [previous post](/posts/creating-a-custom-magento-module/) as both
relate to the customer. We then start with the following structure:

    .
    `-- app
        |-- code
        |   `-- local
        |       `-- Seconddrawer
        |           `-- SDCustomer
        |               `-- etc
        |                   `-- config.xml
        |               `-- controllers
        |                   `-- AccountController.php
        `-- etc
            `-- modules
                `-- Seconddrawer_All.xml

## Modifying the controller

Magento is written for PHP5 and uses nice OO principles which make this kind of
thing a little easier. What we are going to to is _extend_ the existing core
controller and simply change the functions that want. For this example we are
just going to add some logging code whenever the welcome email is sent. This is
performed in the account controller\'s _\_welcomeCustomer_ function.

Firstly, strip out all functions except the _\_welcomeCustomer_ function and make it look like
this:

```php
<?php

require_once 'Mage/Customer/controllers/AccountController.php';

class Seconddrawer_SDCustomer_AccountController extends Mage_Customer_AccountController
{
  public function preDispatch()
  {
    parent::preDispatch();
    $this->getRequest()->setRouteName('customer');
  }


  protected function _welcomeCustomer(Mage_Customer_Model_Customer $customer, $isJustConfirmed = false)
  {
    $this->_getSession()->addSuccess($this->__('Thank you for registering with %s', Mage::app()->getStore()->getName()));

    /* don't send any email
    $customer->sendNewAccountEmail($isJustConfirmed ? 'confirmed' : 'registered');
    */

    /* but log it */
    error_log('Email was NOT sent');

    $successUrl = Mage::getUrl('*/*/index', array('_secure'=>true));
    if ($this->_getSession()->getBeforeAuthUrl()) {
      $successUrl = $this->_getSession()->getBeforeAuthUrl(true);
    }
    return $successUrl;
  }
}
```

Note that our class name follows the same naming scheme as our module and that
it extends the Mage controller (not the class the the core controller itself
extends. To be sure, we place a 'require_once' at the top of the file to make
sure the the core class is there to be included, it will only do this if
necessary.

We have then simply commented out the line that sends the email and inserted
one that does some logging. There is no need to close the PHP tag as it is
not required by PHP or Magento's style and it reduces the troubles that can
occur by whitespace being sent before headers.

It is important to note the preDispatch method also. It calls the extend class
to do some setup but then sets our routing through 'customer' which is really
the core's customer. If we were to define all our own customer views and
layouts then we would not need this but for this example we are only modifying
the functionality of the controller so we want all rendering untouched.

So now we have our modified controller, we just need to tell Magento to start
using it.

## Get Magento to use our new controller

Like any module, the configuration lives in the config.xml file. We have
already modified this file in the previous post but now we need to add the
routing to tell Magento to direct calls to our own controller.

We adjust our module's config file to looke like this:

```xml
<?xml version="1.0"?>
<config>
  <modules>
    <Seconddrawer_SDCustomer>
      <version>0.2.0</version>
    </Seconddrawer_SDCustomer>
  </modules>

  <global>
    <fieldsets>
      <customer_account>

      <!-- snip -->

      </customer_account>
    </fieldsets>

    <routers>
      <customer>
        <rewrite>
          <account>
            <to>Seconddrawer_SDCustomer/account</to>
            <override_actions>true</override_actions>
          </account>
        </rewrite>
      </customer>
    </routers>
  </global>

  <frontend>
    <routers>
      <sdcustomer>
        <use>standard</use>
        <args>
          <module>Seconddrawer_SDCustomer</module>
          <frontName>sdcustomer</frontName>
        </args>
      </sdustomer>
    </routers>
  </frontend>

</config>
```

The code from the [previous post](/posts/creating-a-custom-magento-module/) has
been removed for clarity. What you will notice is that we have added a section
under 'routers' both for 'global' and 'frontend'. The naming scheme, again,
must match the module folder structure.  Here we have told Magento that
requests to 'customer/account' will be rewritten to the new controller which
will override some actions. The frontend section also allows us to modify view
for this controller. It is included here for completeness but with the
preDispatch function we defined in the controller all frontend rendering will
still go through the core defined process.

If we still have our module activated in _app/etc/modules/Seconddrawer_All.xml_
then our modified controller should start being used immediately, as seen in
your logs.

The files used are as follows:

    .
    `-- app
        |-- code
        |   `-- local
        |       `-- Seconddrawer
        |           `-- SDCustomer
        |               |-- etc
        |               |   `-- config.xml
        |               `-- controllers
        |                   `-- AccountController.php
        `-- etc
            `-- modules
                `-- Seconddrawer_All.xml



## Conclusion

Magento is a beast, a powerful but not very well documented one. Hopefully this
simple example shows how the Magento core code can be modified and activated
without too much fuss. Just a little more documentation thrown in to the cloud.

