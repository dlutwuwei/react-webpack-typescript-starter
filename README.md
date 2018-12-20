# mp-eidtor-sdk

目前封装了头条号的图片插件

## 包含插件类别
1. header 标题
2. bold 加粗
3. italic 斜体
4. blockquote 注解
5. ordered list 有序列表
6. bullet list 无序列表
7. code 代码块
8. hr 分割线
9. image 图片

## 默认开启
1. header
2. bold
3. blockquote
4. ordered list
5. bullet list
6. hr 分割线
7. code 代码块

editorOptions默认内容：

```js
{
  modules: {
    toolbar: [
        { name: 'bold', icon: 'bold_tool', tooltip: '加粗'},
        { name: 'italic', icon: 'italic_tool', tooltip: '斜体' },
        { name: 'header', value: ['1', '2', '3'], config: { tagName: ['h1', 'h2', 'h3'] }, tooltip: '标题1' },
        { name: 'blockquote', icon: '', config: { multiline: false }, tooltip: '注解' },
        { name: 'code-block', icon: '', config: { multiline: false }, tooltip: '代码块' },
    ]
  }
}
```