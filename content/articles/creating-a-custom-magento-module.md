---
kind: article
date: 2009-12-27
title: Creating a custom Magento module
description: How to create a basic custom module for Magento Ecommerce using Magento 1.4
tags:
- magento
- php
---

Magento has become one of the best open source commerce systems for the web but
sadly (and frustratingly) it is one of the most poorly documented beasts.

Therefore, to add to the documentation around, here is a simple guide to
creating a custom module in Magento. It does not overwrite any core code so
upgrades are nicer.

In the next couple of posts we are going to do the following:

- organise our folder structure
- add custom fields to the customer objects
- [customise our customer controller](/posts/customising-magento-controllers/)

## Organising your custom code

We do not want to change the core Magento code. If we do then all our change
will be lost when we upgrade Magento. So we have to first copy the files we
want to change into our own 'local' folder structure. The standard Magento
folder structure looks like this:

    .
    |-- app
    |   |-- code
    |   |   |-- core
    |   |   |   |-- Mage
    |   |   |   `-- Zend
    |   |   `-- local
    |   |       `-- Seconddrawer
    |   |-- design
    |   |   |-- adminhtml
    |   |   |   `-- default
    |   |   |-- frontend
    |   |   |   `-- default
    |   |   `-- install
    |   |       `-- default
    |   `-- etc
    |       `-- modules
    `-- skin
        `-- frontend
            `-- default
                `-- default

Notice the 'Seconddrawer' folder under _app/code/local_. This is where we will
copy the files from _app/code/core/Mage_ that we wish to edit. For instance, we
will be editing the customer account controller from
_app/code/core/Mage/Customer/controllers/AccountController.php_ so we would
copy it to
_app/code/local/Seconddrawer/SDCustomer/controllers/AccountController.php_ for
a structure like this:

    .
    `-- app
        `-- code
            |-- core
            |   `-- Mage
            |       `-- Customer
            |           |-- controllers
            |           |   |-- AccountController.php
            |           |   `-- ...etc...
            |           `-- ...etc...
            `-- local
                `-- Seconddrawer
                    `-- SDCustomer
                        `-- controllers
                            `-- AccountController.php

Notice that we have used our company name (Seconddrawer) in place of 'Mage' and
our own module name (SDCustomer) in place of the core 'Customer'. While it is
not essential to create a different name for 'customer' it really helps avoid
naming conflicts for routing etc. in the future. I recommend not naming it the
same. Don\'t add the 'AccountController.php' file yet, we will do that soon!

## Adding additional fields

Our first goal is to add fields to the customer object. We will put all this
into our Seconddrawer/SDCustomer module. To do this we need to add a
configuration file to our module that contains all the extra fields. This
belongs in _app/code/local/Seconddrawer/SDCustomer/etc/config.xml_. All this
does is tell Magento about the extra fields.

### Tell Magento about the extra fields

We can copy the file from the equivelant place in the core folder and then
remove all the XML nodes that don't interest us, adding additional ones also.
The resulting _app/code/local/Seconddrawer/SDCustomer/etc/config.xml_ file will
look something like this:

    <?xml version="1.0"?>
    <config>
      <modules>
        <Seconddrawer_SDCustomer>
          <version>0.1.0</version>
        </Seconddrawer_SDCustomer>
      </modules>

      <global>
        <fieldsets>
          <customer_account>
            <prefix><create>1</create><update>1</update><name>1</name></prefix>
            <firstname><create>1</create><update>1</update><name>1</name></firstname>
            <middlename><create>1</create><update>1</update><name>1</name></middlename>
            <lastname><create>1</create><update>1</update><name>1</name></lastname>
            <suffix><create>1</create><update>1</update><name>1</name></suffix>
            <email><create>1</create><update>1</update></email>
            <password><create>1</create></password>
            <confirmation><create>1</create></confirmation>
            <dob><create>1</create><update>1</update></dob>
            <taxvat><create>1</create><update>1</update></taxvat>

            <customfield1><create>1</create><update>1</update></customfield1>
            <customfield2><create>1</create><update>1</update></customfield2>
            <customfield3><create>1</create><update>1</update></customfield3>
            <customfield4><create>1</create><update>1</update></customfield4>

          </customer_account>
        </fieldsets>
      </global>
    </config>

The important points to notice here are the section at the top under 'modules'.
Here is where we define the module name and version. The module name must match
that of the folder structure under _app/code/local_. We have also added the 4
extra custom fields to the end of the _global/fieldset/customer_account_ XML
node.

The rest of the config.xml file from the core section is not needed due to the
way that Magento will merge in config files. The details in our own local copy
will be merged (not replaced) with the existing core one.

### Create the extra fields

We now need to actually put the fields in the database for Magento to find.
This only needs to be done once. I place the following code in the root
index.php file and hit any page within Magento. For development this is fine.
Once the database fields have been created you should comment out or remove the
extra code.

(There is a way to get this to work by creating SQL files within your module
but lets go with this simpler hack!)

So we put this at the end of _/index.php_:

    <?php

    /* right at the end of the file */

    $setup = new Mage_Eav_Model_Entity_Setup('core_setup');
    $setup->addAttribute('1', 'Custom Field 1', array('label' => 'Customer Field 1', 'type' => 'int', 'input' => 'select', 'required' => false, 'source' => 'eav/entity_attribute_source_boolean'));
    $setup->addAttribute('1', 'Custom Field 2', array('label' => 'Custom Field 2', 'type' => 'text', 'required' => false));
    $setup->addAttribute('1', 'Custom Field 3', array('label' => 'Custom Field 3', 'type' => 'text', 'required' => false));
    $setup->addAttribute('1', 'Custom Field 4', array('label' => 'Custom Field 4', 'type' => 'text', 'required' => false));

You can read the documentation on the parameters for 'addAttribute' to see what
else can be included. **Remember to comment or delete this code once it has
been run!**

### Tell Magento about your module

Magento will still not be showing any extra fields. They should be in the
database but the module has not yet been loaded. To do this we need to tell
Magento about our module. We add an extra XML file in the _app/etc/modules_
folder called Seconddrawer_All.xml:

    <?xml version="1.0"?>
    <config>
      <modules>
        <Seconddrawer_SDCustomer>
          <active>true</active>
          <codePool>local</codePool>
        </Seconddrawer_SDCustomer>
      </modules>
    </config>

The naming scheme needs to be exactly the same as the module\'s config file we
added earlier. It tells Magento where to find the module (by the naming scheme
and folder structure) and that it is active. Once this file has been added
Magento should show these extra fields in the customer section in the admin
backend.

These are the files used in this example:

    .
    |-- app
    |   |-- code
    |   |   `-- local
    |   |       `-- Seconddrawer
    |   |           `-- SDCustomer
    |   |               `-- etc
    |   |                   `-- config.xml
    |   `-- etc
    |       `-- modules
    |           `-- Seconddrawer_All.xml
    `-- index.php

Continue on to see [how to customise the customer account
controller](/posts/customising-magento-controllers/).
