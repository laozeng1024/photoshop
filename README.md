# 功能
photoshop脚本从exif获取日期，自动添加日期水印。

# 使用方法

photoshop-文件-脚本-浏览，选择脚本js，根据提示选择照片所在目录，批量添加日期水印。

# 注意事项

1. 如照片经过处理没有exif日期信息，或exif无法读取日期信息，则从文件名从读取日期。可将照片文件名命名为日期格式，如2020-06-01.jpg

2. 相机语言为英文，exif日期字段可能为英文，需要自行修改“photoTimeStr”字段，并用urlencode编码。

3. 可通过customStr字段自定义日期水印外的文字，同样需要urlencode编码。