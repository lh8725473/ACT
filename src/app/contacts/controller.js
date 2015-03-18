angular.module('App.Contacts').controller('App.Contacts.Controller', [
  '$scope',
  'CONFIG',
  'Contact',
  'Utils',
  '$modal',
  function(
    $scope,
    CONFIG,
    Contact,
    Utils,
    $modal
  ) {
    //联系人列表
    $scope.contactList = Contact.getContactList();
    /*
    //添加联系人
    $scope.addContact = function() {
      var addContactModal = $modal.open({
        templateUrl: 'src/app/contacts/add-contact.html',
        windowClass: 'add-contact-modal-view',
        backdrop: 'static',
        controller: addContactController,
        resolve: {
          contactList: function() {
            return $scope.contactList;
          }
        }
      })
    }

    // add contact
    var addContactController = [
      '$scope',
      '$modalInstance',
      'contactList',
      function(
        $scope,
        $modalInstance,
        contactList
      ) {

        $scope.contactList = contactList;

        $scope.ok = function(contact_email, contact_name) {
          Contact.addContact({
            contact_email: contact_email,
            contact_name: contact_name
          }).$promise.then(function(contact) {
            $scope.contactList.push(contact)
          });
          $modalInstance.close();
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    //更新联系人
    $scope.updateContact = function(contact) {
      var updateContactModal = $modal.open({
        templateUrl: 'src/app/contacts/update-contact.html',
        windowClass: 'update-contact-modal-view',
        backdrop: 'static',
        controller: updateContactController,
        resolve: {
          contact: function() {
            return contact
          }
        }
      })
    }

    // update contact
    var updateContactController = [
      '$scope',
      '$modalInstance',
      'contact',
      function(
        $scope,
        $modalInstance,
        contact
      ) {

        $scope.contact = contact;
        $scope.contact_name = contact.contact_name;

        $scope.ok = function(contact_name) {
          Contact.updateContact({
            id: $scope.contact.contact_id
          }, {
            contact_name: contact_name
          }).$promise.then(function() {
            contact.contact_name = $scope.contact_name;
          });
          $modalInstance.close();
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]
    */
    //删除联系人
    $scope.deleteContact = function(contact) {
      var deleteContactModal = $modal.open({
        templateUrl: 'src/app/contacts/delete-contact-confirm.html',
        windowClass: 'delete-contact-modal-view',
        backdrop: 'static',
        controller: deleteContactController,
        resolve: {
          contact: function() {
            return contact;
          },
          contactList: function() {
            return $scope.contactList;
          }

        }
      })
    }

    // delete contact
    var deleteContactController = [
      '$scope',
      '$modalInstance',
      'contact',
      'contactList',
      function(
        $scope,
        $modalInstance,
        contact,
        contactList
      ) {

        $scope.contactList = contactList
        $scope.contact = contact;

        $scope.ok = function() {
          Contact.deleteContact({
            id: $scope.contact.contact_id
          }).$promise.then(function() {
            for (var i = 0; i < $scope.contactList.length; ++i) {
              if ($scope.contactList[i].contact_id == $scope.contact.contact_id) {
                $scope.contactList.splice(i, 1)
                break
              }
            }
          }, function(error) {
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: error.data.result,
              closeable: false
            })
          });
          $modalInstance.close();
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

  }
])