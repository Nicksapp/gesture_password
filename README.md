# Web 手势密码

> 在移动端设备上，“手势密码”成为一个很常用的 UI 组件。一个手势密码的界面大致如下：

![](https://p1.ssl.qhimg.com/t01d73f4b567014b497.png)

用户用手指按顺序依次划过 9 个原点中的若干个（必须不少于 4 个点），如果划过的点的数量和顺序与之前用户设置的相同，那么当用户的手指离开屏幕时，判定为密码输入正确，否则密码错误。

要求：实现一个移动网页，允许用户设置手势密码和验证手势密码。已设置的密码记录在本地 localStorage 中。
界面原型和操作流程如下：

* 用户选择设置密码，提示用户输入手势密码
* 如果不足 5 个点，提示用户密码太短
* 提示用户再次输入密码
* 如果用户输入的两次密码不一致，提示并重置，重新开始设置密码
* 如果两次输入一致，密码设置成功，更新 localStorage
* 切换单选框进入验证密码模式，将用户输入的密码与保存的密码相比较，如果不一致，则提示输入密码不正确，重置为等待用户输入。
* 如果用户输入的密码与 localStorage 中保存的密码一致，则提示密码正确。

![](http://ww4.sinaimg.cn/large/0060lm7Tgy1fdzcsekt20j30gu0u8756.jpg)
![](http://ww2.sinaimg.cn/large/0060lm7Tgy1fdzcseip2rj30gy0ucmyb.jpg)
![](http://ww2.sinaimg.cn/large/0060lm7Tgy1fdzcseimikj30h00ua75d.jpg)
![](http://ww1.sinaimg.cn/large/0060lm7Tgy1fdzcsehscij30h20u8gms.jpg)
