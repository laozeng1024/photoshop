/*
文件：auot_add_date.js
功能：photoshop脚本从exif获取日期，自动添加日期水印。如没有exif日期信息，则从文件名从读取日期。
作者：laozeng,https://github.com/laozeng1024
*/

//自定义字符串，如“@上海”，使用urlencode编码
var customStr = "%40%E4%B8%8A%E6%B5%B7";
//exif中“日期时间”字段名称，urlencode编码
var photoTimeStr = "%E6%97%A5%E6%9C%9F%E6%97%B6%E9%97%B4";

var inputFolder = Folder.selectDialog("请选择需要添加日期水印图片所在文件夹：");
var outFolder = Folder.selectDialog("选择图片保存输出的文件夹：");

//判断文件夹是否存在
if (inputFolder != null && inputFolder != null) 
{
    //获得文件夹下的所有图片
    var fileList = inputFolder.getFiles();

    //遍历图片
    for (var i = 0; i < fileList.length; i++)
    {
        //判断图片是否正常文件，并且处于非隐藏状态
        if (fileList[i] instanceof File && fileList[i].hidden == false) 
        {       
            //打开遍历到的图片
            var docRef = open(fileList[i]);

            //设置另存路径文件名，重命名为:new_原文件名
            var fileout = new File(outFolder+'/new_'+ basename(fileList[i]))

            //获得exif照片日期，可自行加自定义文字customStr
            //photoTime = getExifData(docRef) + decodeURIComponent(customStr)
            photoTime = getExifData(docRef)
            //如果exif没有日期数据，从文件名读取
            if (photoTime == 0)
            {
                photoTime = basename(fileList[i])
                photoTime = photoTime.toString().slice(0, -4)
            }

            //新建图层
            var layerRef = docRef.artLayers.add();

            //设置为文字图层
            layerRef.kind = LayerKind.TEXT;

            //设置图层文字
            layerRef.textItem.contents = photoTime;

            //根据图片宽度比例，设置文字大小
            layerRef.textItem.size = docRef.width/20;

            //定义颜色
            var color = new RGBColor();

            //设置red属性
            color.red = 255;

            //设置green属性
            color.green = 255;

            //设置blue属性
            color.blue = 255;
            
            //定义水印文字的颜色
            var sc = new SolidColor();

            //设置[sc]对象的[rgb]属性的值为变量[color]
            sc.rgb = color;

            //将文本图层的字体颜色设置为变量[sc]
            layerRef.textItem.color = sc;

            //设置文本图层透明度
            layerRef.fillOpacity = 90;

            //将文本图层向下移动。调节日期水印左右和上下位置
            layerRef.translate(250, docRef.height/1.15 - 72);

            //合并文本图层至背景图层
            layerRef.merge();

            //另存照片
            //定义一个变量[asCopy]，用来指定图片以副本的方式保存
            var asCopy = true;

            //定义一个变量[extensionType]，用来指定图片名称的后缀为小写的.jpg
            var extensionType = Extension.LOWERCASE;

            //定义一个变量[options]，用来指定图片保存的格式为JPG。PNG为PNGSaveOptions
            var options = JPEGSaveOptions;
            docRef.saveAs(fileout, options, asCopy, extensionType);
            
            //操作完成后，直接关闭文档
            docRef.close(SaveOptions.DONOTSAVECHANGES);
        }
    }
    alert("添加日期水印，已处理完成！")
 }

//获取exif中的日期
function getExifData(doc) {

var exifData = doc.info.exif;
var photoTime = 0
for(j = 0; j < exifData.length; j++ ) 
{
    encodeStr = encodeURIComponent(exifData[j][0])
    switch(encodeStr)
    {   
        //urlencode 中文再判断
        //日期时间
        case photoTimeStr:
            photoTime = exifData[j][1];
            break;
    }

} 
return photoTime;

}

//获取文件名
function basename(str) {
    str = str.toString();
    var idx = str.toString().lastIndexOf('/')
    idx = idx > -1 ? idx : str.lastIndexOf('\\')
    if (idx < 0) {
        return str
    }
    return str.substring(idx + 1);
}
