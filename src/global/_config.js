var CONFIG = {

  //Socket
  SOCKET_HOST: '192.168.1.52:3232',

  // develop
  //API_ROOT: 'http://101.231.216.75:8888/api',

  // production
  API_ROOT: '/api',

  LOGIN_PATH: 'login.html',

  LOGIN_PATH_EN: 'login-en.html',

  INDEX_PATH: '/index.html',

  //单个上传文件大小(免费版默认1G)
  UPLOAD_FILE_SIZE: 1024*1024*1024,

  //历史版本数(默认免费10个)
  HISTORY_VERSIONS: 10,
  
  //文件夹讨论页中，每次刷新获取多少笔记录
  FOLDER_DISCUSS_PAGE_SIZE:10,

  //permission
  PERMISSION_KEY: ['1111111', '0111111', '0001111', '0000101', '0001110', '0000100', '0000001'],
  PERMISSION_VALUE: ['PERMISSION_VALUE_1', 'PERMISSION_VALUE_2', 'PERMISSION_VALUE_3', 'PERMISSION_VALUE_4', 'PERMISSION_VALUE_5', 'PERMISSION_VALUE_6', 'PERMISSION_VALUE_7'],

  //有拥有者权限的value与tooltip
  OWNER_PERMISSION_VALUE_TOOLTIP: [{v: 'PERMISSION_VALUE_1', t : 'PERMISSION_VALUE_1_TOOLTIP'},
                                   {v: 'PERMISSION_VALUE_2', t : 'PERMISSION_VALUE_2_TOOLTIP'},
                                   {v: 'PERMISSION_VALUE_3', t : 'PERMISSION_VALUE_3_TOOLTIP'},
                                   {v: 'PERMISSION_VALUE_4', t : 'PERMISSION_VALUE_4_TOOLTIP'},
                                   {v: 'PERMISSION_VALUE_5', t : 'PERMISSION_VALUE_5_TOOLTIP'},
                                   {v: 'PERMISSION_VALUE_6', t : 'PERMISSION_VALUE_6_TOOLTIP'},
                                   {v: 'PERMISSION_VALUE_7', t : 'PERMISSION_VALUE_7_TOOLTIP'}
                                  ],

  //无拥有者权限的value与tooltip
  NOOWNER_PERMISSION_VALUE_TOOLTIP: [{v: 'PERMISSION_VALUE_2', t : 'PERMISSION_VALUE_2_TOOLTIP'},
                                     {v: 'PERMISSION_VALUE_3', t : 'PERMISSION_VALUE_3_TOOLTIP'},
                                     {v: 'PERMISSION_VALUE_4', t : 'PERMISSION_VALUE_4_TOOLTIP'},
                                     {v: 'PERMISSION_VALUE_5', t : 'PERMISSION_VALUE_5_TOOLTIP'},
                                     {v: 'PERMISSION_VALUE_6', t : 'PERMISSION_VALUE_6_TOOLTIP'},
                                     {v: 'PERMISSION_VALUE_7', t : 'PERMISSION_VALUE_7_TOOLTIP'}
                                    ],

  //文件ICO path
  ICONS_PATH: 'images/',

  //文件ICO
  ICONS: {
    folder: {
      small: 'web_files_personal.png',
      large: 'file_folder_large.png',
      small_share: 'web_files_shared.png',
      large_share: 'file_folder_share_large.png',
      hide_ring: 'hide_ring.png'
    },
    pdf: {
      small: 'web_files_pdf.png',
      large: 'file_pdf_large.png'
    },
    xls: {
      small: 'web_files_xls.png',
      large: 'file_els_large.png'
    },
    txt: {
      small: 'web_files_txt.png',
      large: 'file_txt_large.png'
    },
    mp3: {
      small: 'web_files_mp3.png',
      large: 'file_mp3_large.png'
    },
    mp4: {
      small: 'web_files_video.png',
      large: 'file_mp4_large.png'
    },
    jpg: {
      small: 'web_files_jpeg.png',
      large: 'file_jpg_large.png'
    },
    doc: {
      small: 'web_files_doc.png',
      large: 'file_doc_large.png'
    },
    zip: {
      small: 'web_files_zip.png',
      large: 'file_zip_large.png'
    },
    ppt: {
      small: 'web_files_ppt.png',
      large: 'file_ppt_large.png'
    },
    note: {
      small: 'file_note.png',
      large: 'file_note_large.png'
    },
    all: { //default icon
      small: 'web_files_unknown.png',
      large: 'file_default_large.png'
    }
  }
}