# EGAIS-organisations-finder
Простое приложение для поиска организаций в справочнике [ЕГАИС](http://egais.ru/) по ИНН.

В личном кабинете можно скачать файлик sprav_org.rar, в котором запакована здоровая XMLка (~200Мб) с записями об ~360.000 организациях (объектах). Кстати, файлик можно скачать и по прямой ссылке: http://egais.ru/files/sprav_org.rar (13.8Мб)

Такой огромный XML-файл практически ничем не получается открыть: Sublime, Notepad++, любые браузеры - все валится из-за нехватки памяти.

Сделал на коленке на NodeJS небольшой [конвертер](https://github.com/FSerg/EGAIS-organisations-finder/blob/master/converter.js), который загружет данные из XMLки в MongoDB, после этого с данными можно удобно работать. Обработать файлик получилось только библиотекой [xml-flow](https://github.com/matthewmatician/xml-flow) - она может читать данные порциями, другие библиотеки типа [Libxmljs](https://github.com/polotek/libxmljs) или [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) пытаются парсить XMLку целиком и падают с ошибкой "out of memory".

В папке [public](https://github.com/FSerg/EGAIS-organisations-finder/tree/master/public) маленькое SPA на Angular'е для поиска организаций по базе в MongoDB. Работает тут: egais.f-pix.ru

Можно к нему обращаться и как сервису простым GET-запросом: egais.f-pix.ru/org/4213005473 где последние цифры - это ИНН организации. Ответом возвращается JSON массив с данными объектов организации:
```sh
[{
    "_id": "010000000046",
    "full_name": "Общество с ограниченной ответственностью \"Сибирская Водочная Компания\"",
    "short_name": "ООО \"СВК\"",
    "inn": "4213005473",
    "kpp": "421301001",
    "country_code": "643",
    "region_code": "42",
    "dejure_address": "РОССИЯ,652152,КЕМЕРОВСКАЯ ОБЛ,,Мариинск,,Юбилейная,2А,,",
    "fact_address": "РОССИЯ,,КЕМЕРОВСКАЯ ОБЛ,Мариинский р-н,Мариинск г,,Юбилейная ул,2А,литер З,З1 (помещение № 2, помещение № 3); литер И; литер К, К1; литер М; литер Н",
    "status": "подключен",
    "updated_at": "2016-01-04T11:09:41.504Z",
    "__v": 0
}]
```
