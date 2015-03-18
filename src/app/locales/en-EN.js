angular.module('App.Locales').config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('en-EN', {
    "LANG_ADMIN_CONSOLE_OF_ACT": "Admin Console",
    "OWNER_PERMISSION_VALUE": "Owner",
    "LOADING": "Loading..",
    "NETWORK_ERROR": "network error",

    "PERMISSION_VALUE_1": "Co-Owner",
    "PERMISSION_VALUE_2": "Editor",
    "PERMISSION_VALUE_3": "Viewer & Uploader",
    "PERMISSION_VALUE_4": "Previewer & Uploader",
    "PERMISSION_VALUE_5": "Viewer",
    "PERMISSION_VALUE_6": "Previewer",
    "PERMISSION_VALUE_7": "Uploader",

    "PERMISSION_VALUE_1_TOOLTIP": "Upload,Download,Preview, Share(Add contacts into a file or Cooperate via link),Edit(Edit Docs,contact's permission,or remove a contact from cooperative files),delete a file",
    "PERMISSION_VALUE_2_TOOLTIP": "Can act like a Owner but delete the owner",
    "PERMISSION_VALUE_3_TOOLTIP": "Upload,Download,Preview,Cooperate via link",
    "PERMISSION_VALUE_4_TOOLTIP": "Upload and Preview",
    "PERMISSION_VALUE_5_TOOLTIP": "Download,Cooperate via link",
    "PERMISSION_VALUE_6_TOOLTIP": "Preview",
    "PERMISSION_VALUE_7_TOOLTIP": "Download",

    "LANG_UPLOAD_FILE": "Upload file",

    "LANG_BUTTON_CONFIRM": "Confirm",
    "LANG_BUTTON_CANCEL": "Cancel",

    "*********************************************************-*": "user-discuss",
    "DISCUSS_CONTENT_EMPTY": "Content is not empty",
    "DISCUSS_CONTENT_LIMIT": "Content length exceed 200 characters",
    "DISCUSS_ENTER_KEY_SEND": "Press Enter key to send, Shift+Enter to change line, and each comment could not be more than 200 words.",
    "USER_DISCUSS_FILE_PREVIEW": "Preview",
    "USER_DISCUSS_REVERT_THIS_VERSION": "Revert",
    "USER_DISCUSS_CURRENT_VERSION": "Current Version",
    "USER_DISCUSS_VERSION_DOWNLOAD": "Download",
    "USER_DISCUSS_VERSION_REVERT_FAILED": "Revert Failed",
    "USER_DISCUSS_VERSION_ACTION_CREATE": "create",
    "USER_DISCUSS_VERSION_ACTION_UPDATE": "update",
    "USER_DISCUSS_VERSION_ACTION_REVERT": "revert",

    "*********************************************************-": "create-tag",
    "LANG_TAG_MESSAGE_EMPTY_TAG": "Tag can not empty",
    "LANG_TAG_MESSAGE_MAX_TAG": "Only 3 tags can be added",
    "LANG_TAG_MESSAGE_CREATE_SUCCESS": "The tag has been added successfully",
    "LANG_TAG_MESSAGE_DELETE_SUCCESS": "The tag has been deleted successfully",

    "LANG_TAG_SET_TAG": "Tag",
    "LANG_TAG_NO_TAG": "No tag",
    "LANG_TAG_ADD_TAG": "Add a tag",
    "LANG_TAG_ADD_TAG_LIMIT": "One file can only add 3 tags. Each tag can only contain less than 6 words",
    "LANG_TAG_ADD": "Add",

    "*********************************************************": "Invite-team-users",
    "LANG_INVITE_MESSAGE_EMPTY_MAIL": "Contact's email address can not empty",
    "LANG_INVITE_MESSAGE_DEFAULT_INVITE_CONTENT": "Hi, I want to share this folder to you in HandsSync",
    "LANG_INVITE_MESSAGE_INVITE_SUCCESS": "Your invitiation has been sent successfully",

    "LANG_INVITE_TO": "Invite to ",
    "LANG_INVITE_EXTERNAL_USER_HINT": "Enter an email address to invite outer user",
    "LANG_INVITE_OR": "or",
    "LANG_INVITE_SELECT": "Select from Contacts List",
    "LANG_INVITE_SELECTED": "Selected",
    "LANG_INVITE_ACCESS_AUTHORITY": "Access Permission",
    "LANG_INVITE_NOTES": "Invite Message",
    "LANG_INVITE_SENT_INVITATION": "Send Invitation",
    "LANG_INVITE_ENTER_SEARCH": "Search",

    "*********************************************************": "Link-share",
    "LANG_LINK_ONLY_PREVIEW": "Only Preview",
    "LANG_LINK_ONLY_UPLOAD": "Only Upload",
    "LANG_LINK_PREVIEW_AND_DOWNLOAD": "Preview and Download",
    "LANG_LINK_PREVIEW_AND_DOWNLOAD_AND_UPLOAD": "Preview, Upload and Download",
    "LANG_LINK_PREVIEW_AND_DOWNLOAD": "Preview and Download",

    "LANG_LINK_OLD_PASSWORD": "Old Password",
    "LANG_LINK_ENTER_PASSWORD": "Please enter access password",

    "LANG_LINK_RECEIVER_NOT_NULL": "Receive email address can not empty",
    "LANG_LINK_SEND_MAIL_SUCCESS": "Your invitiation Email has been sent successfully",
    "LANG_LINK_COPY_LINK": "Link Address has been copied to your clipboard",


    "LANG_LINK_SHARE": "Link Share",
    "LANG_LINK_EXPIRER_DATE": "The link will be expired on",
    "LANG_LINK_SET_ACCESS_PASSWORD": "Set Password",
    "LANG_LINK_ENTER_ACCESS_PASSWORD": "Please enter password",
    "LANG_LINK_AUTHORITY": "Access Permission",
    "LANG_LINK_DESCRIPTION": "Description",
    "LANG_LINK_GENERATE_LINK": "Generate Link",
    "LANG_LINK_ADDRESS": "Access Link",
    "LANG_LINK_COPY": "Copy",
    "LANG_LINK_RETURN": "Edit Link",
    "LANG_LINK_MAIL_SHARE": "Share the link via Email",
    "LANG_LINK_SEND_MAIL": "Send Email",
    "LANG_DATE_EMPTY": "expiration date is not empty",
    "LANG_DATEPICKER_TODAY": "Today",
    "LANG_DATEPICKER_EMPTY": "Clear",
    "LANG_DATEPICKER_COLSE": "Colse",

    "*********************************************************": "Move-file",
    "LANG_MOVE_FOLDER": "Move Folder",
    "LANG_MOVE_MOVE": "Move to",
    "LANG_MOVE_FILES" : "Move Folder",
    "LANG_MOVE_FILES_CONFIRM": "Are you sure you want to move this file?",
    "LANG_MOVE_FILES_SAME_NAME_FILE": "File already exist or the operation without permission",

    "*********************************************************": "Copy-file",
    "LANG_Copy_FOLDER": "Copy Folder",
    "LANG_Copy_MOVE": "Copy to",
    "LANG_Copy_FILES": "Copy Folder",
    "LANG_Copy_FILES_CONFIRM": "Are you sure you want to Copy this file?",

    "*********************************************************": "Preview-file",
    "LANG_PREVIEW_UPLOAD_NEW_VERSION": "Upload a new version",
    "LANG_PREVIEW_FILE": "Preview",
    "LANG_PREVIEW_DOWNLOAD_FILE": "Download",
    "LANG_PREVIEW_DISCUSS": "Discuss",
    "LANG_PREVIEW_VERSION": "Version",
    "LANG_PREVIEW_POST": "Send",
    "LANG_PREVIEW_AT_COLLABORATOR": "Try to @ a cooperator",

    "*********************************************************": "Search-file",
    "LANG_SEARCH_FILE_NOT_NULL": "Search field cannot be empty or special characters.",
    "LANG_SEARCH_FILE_RESULT": "Search Result: ",
    "LANG_SEARCH_FILE_FIND": "Find {{length}} files(folders) about \"<font color=\"red\">{{key}}</font>\"",

    "*********************************************************": "files",
    "LANG_FILES_CREATE_FOLDER_SUCCESS_MESSAGE": "Your folder has been created successfully",
    "LANG_FILES_DELETE_FOLDER_SUCCESS_MESSAGE": "Your folder has been deleted successfully",
    "LANG_FILES_DELETE_FILE_SUCCESS_MESSAGE": "Your file has been deleted successfully",
    "LANG_FILES_QUIT_COLLABORATION_MESSAGE": "You have quit cooperation successfully",
    "LANG_FILES_EMPTY_FOLDER_MESSAGE": "File or folder name can not empty",
    "LANG_FILES_MOVE_FOLDER_SUCCESS_MESSAGE": "Move file successfully.",
    "LANG_FILES_NO_SPACE_MESSAGE": "You storage space is not enough",
    "LANG_FILES_UPLOAD_FAILED_MESSAGE": "Upload failed",
    "LANG_FILES_PREVIEW_LIMITATION_MESSAGE": "Only 10MB files could be previewed.",
    "LANG_FILES_NOT_MORE_THAN_1G": "Upload size not more than 1G",
    "LANG_FILES_NOT_MORE_THAN_1G": "Upload size not more than 5G",
    "LANG_FILES_FOLDER_NAME_NOT_NULL": "Folder name could not be null.",
    "LANG_FILES_FOLDER_NAME_NOT_MORE_THAN_200": "Folder name length could not be more than 200 characters.",
    "LANG_FILES_FOLDER_NAME_CONTAIN_SPENCIAL_CHARACTERS": "Folder name could not contain special characters\\ \/ \: \* \? \" \< \> \|",
    "LANG_FILES_VERSION_TITLE": "Version",

    "*********************************************************": "delete files",
    "LANG_DELETE_FILES": "Delete",
    "LANG_DELETE_FILES_CONFIRM": "Are you sure you want to delete the selected files?",

    "*********************************************************": "delete share group confirm",
    "LANG_DELETE_GROUP": "Remove",
    "LANG_DELETE_GROUP_CONFIRM": "Are you sure to remove this group from current file?",

    "*********************************************************": "delete share user confirm",
    "LANG_DELETE_SHARE_USER": "Remove",
    "LANG_DELETE_SHARE_USER_CONFIRM": "Are you sure to remove this contact from current file?",

    "*********************************************************": "modal-upload",
    "LANG_UPLOAD_FILE": "Upload File",
    "LANG_UPLOAD_SELECT_FILE_TO_UPLOAD": "Select a file to upload",
    "LANG_UPLOAD_DRAG_FILE_TO_UPLOAD": "You can also drag files here to upload",

    "*********************************************************": "quit team confirm",
    "LANG_TEAM_QUIT_COLLABORATION": "Quit Cooperation",
    "LANG_TEAM_QUIT_COLLABORATION_CONFIRM": "Are you sure to quit cooperation?",

    "*********************************************************": "team",
    "LANG_TEAM_UPDATE_AUTHORITY_SUCCESS_MESSAGE": "Update permission successfully",
    "LANG_TEAM_DELETE_COLLABORATION_SUCCESS_MESSAGE": "Delete cooperation successfully",


    "*********************************************************": "team-cooperation",
    "LANG_TEAM_COLLABORATION_TIPS": "New Share Approach",
    "LANG_TEAM_COLLABORATION_COLLABORATE_SHARE": "Cooperate Share",
    "LANG_TEAM_COLLABORATION_LINK_SHARE": "Link Share",
    "LANG_TEAM_COLLABORATION_ALL_COLLABORATOR": "All Cooperators",
    "LANG_TEAM_COLLABORATION_INVITE_OTHERS": "Invite Others",

    "*********************************************************": "app files",
    "LANG_FILE_ROOT_FOLDER": "Root",
    "LANG_FILE_NEW_FOLDER": "New Folder",
    "LANG_FILE_DELETE": "Delete",
    "LANG_FILE_NAME": "Name",
    "LANG_FILE_STATUS": "Status",
    "LANG_FILE_SIZE": "Size",
    "LANG_FILE_AUTHORITY": "Permission",
    "LANG_FILE_SHARE": "Share",
    "LANG_FILE_FOLDER_NAME": "Name",
    "LANG_FILE_EXTERNAL_LINK_COLLABORAT": "Cooperate via link",
    "LANG_FILE_INVITE_COLLABORATOR": "Add new cooperator",
    "LANG_FILE_DISCUSS": "Comment",
    "LANG_FILE_DOWNLOAD": "Download",
    "LANG_FILE_MOVE": "Move to",
    "LANG_FILE_COPY": "Copy to",
    "LANG_FILE_RENAME": "Rename",
    "LANG_FILE_DISCUSS": "Comment",
    "LANG_FILE_ADD_TAG": "Add a tag",
    "LANG_FILE_QUIT_COLLABORATION": "Leave",
    "LANG_FILE_DISCUSS": "Comment",
    "LANG_FILE_VERSION": "version history",
    "LANG_FILE_PREVIEW": "Preview >",
    "LANG_FILE_REPLY": "Reply",
    "LANG_FILE_POST": "Send",
    "LANG_FILE_AT_COLLABORATOR": "Try to @ a cooperator",
    "LANG_FILE_VIEW_LINK": "View Link",
    "LANG_FILE_GENERATE_LINK": "Generate Link",
    "LANG_FILE_DELETE_SUCCESS_MESSAGE": "Delete successfully",
    "LANG_FILE_MOVE_SUCCESS_MESSAGE": "Move successfully",
    "LANG_FILE_MOVE_FAILED_MESSAGE": "Move failed",
    "LANG_FILE_COPY_SUCCESS_MESSAGE": "Copy successfully",
    "LANG_FILE_COPY_FAILED_MESSAGE": "Copy failed",

    "LANG_FILE_DISCUSS_EMPTY_MESSAGE": "Comment can not empty",
    "LANG_FILE_DELETE_DISCUSS": "Delete Comment",
    "LANG_FILE_DELETE_DISCUSS_CONFIRM_MESSAGE": "Are you sure to delete it",
    
    "LANG_FILE_IS_NULL": "Folder is empty, please click 'uplode file' to uplode file",

    "*********************************************************": "user-info",
    "LANG_USER_ENTER_OLD_PASSWORD": "Enter your old Password",
    "LANG_USER_ENTER_NEW_PASSWORD": "Enter your new Password",
    "LANG_USER_ENTER_OLD_PASSWORD_CONFIRM": "Re-enter your new Password",
    "LANG_USER_ENTER_REAL_NAME": "Enter your name",
    "LANG_USER_NEW_PASSWORD_MISMATCH": "Password did not match.Try again.",
    "LANG_USER_PASSWORD_LENGTH_LIMIT": "Your password must contain between 6 and 16 words",
    "LANG_USER_SAVE_SUCCESS": "Saved",
    "LANG_USER_INVALID_AVATOR_IMAGE": "Please upload image with jpg, jpeg or png format",

    "LANG_USER_ACCOUNT_SETTING": "Account Setting",
    "LANG_USER_PERSONAL_SETTING": "Personal Setting",
    "LANG_USER_UPLOAD_NEW_AVATOR": "Click to upload a new picture",
    "LANG_USER_NAME": "Name",
    "LANG_USER_MOBILE_NUMBER": "Phone",
    "LANG_USER_EMAIL_ADDRESS": "E-mail",
    "LANG_USER_UPDATE_PASSWORD": "Change password",
    "LANG_USER_CURRENT_PASSWORD": "Old password",
    "LANG_USER_NEW_PASSWORD": "New password",
    "LANG_USER_CONFIRM_PASSWORD": "Confirm password",
    "LANG_USER_SAVE": "Save",

    "*********************************************************": "Header message",
    "LANG_HEADER_MESSAGE_DELETE_SUCCESS": "Your file has been successfully deleted",

    "LANG_HEADER_INFO": "A high-efficency cooperative platform for the cloud era",
    "LANG_HEADER_PERSONAL_INFORMATION": "Account Setting",
    "LANG_HEADER_QUIT": "Log Out",
    "LANG_HEADER_ADMIN_CONTROL": "Admin Console",
    "LANG_HEADER_MESSAGE": "Message",
    "LANG_HEADER_MARK_AS_READ": "Readed",
    "LANG_HEADER_DELETE": "Delete",
    "LANG_HEADER_NOTIFICATION": "Notice",
    "LANG_HEADER_SEARCH_HINT": "Search your files",
    "LANG_HEADER_SEARCH": "Search",

    "*********************************************************": "Upload progress-dialog",
    "LANG_UPLOAD_LIST": "Uploading",

    "*********************************************************": "Sidebar",
    "LANG_SIDE_BAR_ALL_FILES": "All Files",
    "LANG_SIDE_BAR_CONTACT": "Contact",
    "LANG_SIDE_BAR_TRASH": "Recycle Bin",
    "LANG_SIDE_BAR_USAGE": "Usage",

    "*********************************************************": "Trash",
    "LANG_TRASH_RECYCLE_BIN": "Recycle Bin",
    "LANG_TRASH_RECYCLE_EMPTY": "Empty",
    "LANG_TRASH_RECYCLE_UNDELETE": "Undelete",
    "LANG_TRASH_RECYCLE_DELETE": "Delete",
    "LANG_TRASH_RECYCLE_FILE_NAME": "File Name",
    "LANG_TRASH_RECYCLE_DELETE_DATE": "Delete Time",
    "LANG_TRASH_RECYCLE_SIZE": "Size",
    "LANG_TRASH_RECYCLE_ON": " on ",
    "LANG_TRASH_RECYCLE_UPDATE": " update",
    "LANG_TRASH_RECYCLE_COMFIRM_YES": "ok",
    "LANG_TRASH_RECYCLE_COMFIRM_NO": "cancel",

    "*********************************************************": "Revert recycle confirm",
    "LANG_TRASH_REVERT_COMFIRM_UNDELETE": "Undelete",
    "LANG_TRASH_REVERT_COMFIRM_UNDELETE_CONFIRM": "Are you sure you want to undelete the seleted file(s)?",  

    "*********************************************************": "Empty recycle confirm",
    "LANG_TRASH_EMPTY_COMFIRM_EMPTY": "Empty",
    "LANG_TRASH_EMPTY_COMFIRM_EMPTY_CONFIRM": "Are you sure you want to empty the recycle bin?",

    "*********************************************************": "Delete recycle confirm",
    "LANG_TRASH_DELETE_COMFIRM_DELETE": "Delete",
    "LANG_TRASH_DELETE_COMFIRM_DELETE_CONFIRM": "Are you sure you want to delete the seleted file(s)?",

    "*********************************************************": "Contacts",
    "LANG_CONTACTS_HEADER": "Contact",
    "LANG_CONTACTS_NAME": "Name",
    "LANG_CONTACTS_EMAIL_ADDRESS": "Email Address",
    "LANG_CONTACTS_PHONE_NUMBER": "Phone Number"

  });
}]);