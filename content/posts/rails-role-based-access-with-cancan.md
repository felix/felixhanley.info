---
kind: article
title: Role based access (RBAC) for Rails
description: The basics of a role based access control system using Ruby on Rails, CanCan and Devise
date: 2011-03-11
tags:
- rails
- ruby
- datamapper
aliases:
- /articles/rails-role-based-access-with-cancan/
---

The basics of a role based access control system using Ruby on Rails,
[CanCan](https://github.com/ryanb/cancan/) and
[Devise](https://github.com/plataformatec/devise).

## Goals

Common requirements/desires for a authentication/authorisation system:

- customisable
- a variety of storage choices (DB, YAML etc.)
- the ability to change access from within the application (think nice
  permission assignments

RBAC authorisation is reasonably common in larger projects and is well described
in the [Wikipedia
article](http://en.wikipedia.org/wiki/Role-based_access_control)

We would like _users_ to be assigned _roles_ and roles enabling a number of
_permissions_. A user may have a number of different roles meaning the
permissions available for each of their roles is combined.

So we will be able to access a user's permissions (using DataMapper) like so:

    #!ruby
    u = User.get(1)
    u.roles.permissions.each {|perm|
      #...
    }

## Models

First of all, get devise and cancan installed and basically configured within
your application. This is not covered here.

These are the models that we will eventually have and their corresponding
relationships. These examples use DataMapper.

    #!ruby
    class User
      include DataMapper::Resource

      # devise setup
      devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :trackable, :validatable


      property :id, Serial
      property :email, String, :required => true, :unique => true, :format => :email_address
      property :active, Boolean
      # ...

      has n, :roles, :through => Resource
      # ...

      # for assignment of roles
      def role_ids=(ids)
        self.roles.clear
        ids.delete_if{|i| i.empty?}.each do |id|
          self.roles << Role.get(id)
        end
      end

      def has_role?(role_sym)
        roles.any? { |r| r.name.underscore.to_sym == role_sym }
      end

      def role?(role)
        return !!self.roles.first(:name => role.to_s.camelize)
      end
    end

    class Role
      include DataMapper::Resource

      property :id, Serial
      property :name, String
      property :description, Text
      # ...

      has n, :users, :through => Resource
      has n, :permissions, :through => Resource
    end

We are using the anonymous join model _Resource_ to link users and roles. We
could quite easily make an actual model to hold extra information (for a
history, perhaps).

There are a few extra methods in the User model to help with the assignment of
roles. This is DataMapper's way of overriding accessors and enables specific
implementations.

## CanCan setup

The permissions for many applications are closely tied to the application's
code. The checks are hard coded into the application. If this is the case there
is no need to have the permissions taken from the database. The roles, yes, but
the defining permissions will only ever change with the application code.

We can then put the permissions in a static file (YAML) in this case and have it
read by the app when needed. CanCan's 'ability' model is a good place to do
this:

    #!ruby
    class Ability
      include CanCan::Ability

      @@permissions = nil

      def initialize(user)
        self.clear_aliased_actions

        alias_action :index, :show, :to => :read
        alias_action :new,          :to => :create
        alias_action :edit,         :to => :update
        alias_action :destroy,      :to => :delete

        user ||= User.new

        # super user can do everything
        if user.role? :super
          can :manage, :all
        else
          # edit update self
          can :read, User do |resource|
            resource == user
          end
          can :update, User do |resource|
            resource == user
          end
          # enables signup
          can :create, User

          user.roles.each do |role|
            if role.permissions
              role.permissions.each do |perm_name|
                unless Ability.permissions[perm_name].nil?
                  can(Ability.permissions[perm_name]['action'].to_sym, Ability.permissions[perm_name]['subject_class'].constantize) do |subject|
                    Ability.permissions[perm_name]['subject_id'].nil? ||
                      Ability.permissions[perm_name]['subject_id'] == subject.id
                  end
                end
              end
            end
          end
        end
      end

      def self.permissions
        @@permissions ||= Ability.load_permissions
      end

      def self.load_permissions(file='permissions.yml')
        YAML.load_file("#{::Rails.root.to_s}/config/#{file}")
      end
    end

This logic is up to you and your project but the above basic implementation does
the following:

- adds another action alias, _modify_
- enables the super user to do everything
- enables the authenticated user to modify (edit, destroy) themselves
- creates a bunch of abilites taken from the YAML permissions file

You can then start using the _action_, _subject_ and optional _object_
paramaters with CanCan to check for permissions for which the CanCan
documentation has many examples.

## Initial Setup

We can then define a few roles to seed the database with for use later. Put
this in db/seed.rb:

    #!ruby
    super_user = User.create(:email => 'super@example.com',
                             :firstname => 'Super',
                             :surname => 'User',
                             :password => 'password',
                             :password_confirmation => 'password',
                             :active => true,
                             :date => Time.now)
    admin_user = User.create(:email => 'admin@example.com',
                             :firstname => 'Admin',
                             :surname => 'User',
                             :password => 'password',
                             :password_confirmation => 'password',
                             :active => true,
                             :date => Time.now)
    user = User.create(:email => 'user@example.com',
                       :firstname => 'User',
                       :surname => 'User',
                       :password => 'password',
                       :password_confirmation => 'password',
                       :active => true,
                       :date => Time.now)

    # create roles
    super_role = Role.create(:name => 'super', :description => 'Super user')
    admin_role = Role.create(:name => 'admin', :description => 'Admin user')
    user_role  = Role.create(:name => 'user', :description => 'Normal user')

    # get our permissions
    permissions = YAML.load_file("#{::Rails.root.to_s}/config/permissions.yml")

    # assign permissions
    admin_role.permissions = permissions.collect{|n,p| n}
    admin_role.save

    # assign roles
    super_user.roles << super_role
    super_user.save
    admin_user.roles << admin_role
    admin_user.save
    user.roles << user_role
    user.save

The actual permissions seeded will be entirely up to you and your application
but this sets up a few basics for one model.

## Further

This also enables you to have a nice report of the roles and their permissions
much like the following:
![RBAC report screenshot](/images/posts/rbac-report.png)

This can be created in the view something like this:

    #!ruby
    = form_tag({:controller => 'roles', :action => 'report'}, :method => 'post') do
      %table
        %tr
          %th= Role.human_attribute_name('permissions')
          - @roles.sort.each do |role|
            %th
              = role.name
              = hidden_field_tag "permissions[#{role.name}][]", ""
        - Ability.permissions.each do |pname, pdetails|
          %tr
            %td= pdetails['description']
            - @roles.sort.each do |role|
              %td
                = check_box_tag "permissions[#{role.name}][]", pname, role.permissions.include?(pname)
      %fieldset.actions
        = submit_tag 'Save'

## Dynamic Permissions

It is quite possible that you may want to have dynamic permissions. For example,
to assign permissions to specific object instances or perhaps in an application
that accesses another service which changes.

If this is the case, you will need to have the permissions based in a dynamic
datastore, most likely the same database. You would need to define a new model
to store them and update the associations and CanCan logic to do authorisation
checks.

[RBAC]: Role Based Access Control
