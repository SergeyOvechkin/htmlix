


## Javascript Frontend Framework


**Htmlix** - яваскрипт фреймворк основаный на data- свойствах html документа. 

## Создание приложения

Для создания приложения htmlix необходимо создать экземпляр **new HTMLixState(state)** передав в него объект с описанием приложения, в котором находятся все компоненты, эмитеры событий, общие методы и переменные всего приложения, а таже другие настройки...




## Компоненты

Компонентами в **htmlix** выступают контейнеры и массивы. Контейнер это html элемент с различным набором свойств. 
Массив это html элемент который является хранилищем для однотипных контейнеров.
Свойство это обьект имеющий доступ к html данным например тексту или атрибуту, также свойство может быть слушателем события.

**Контейнер** 


Для того чтобы создать контейнер необходимо в html указать его название и определить тип "container" в html теге, создадим контейнер page:

```html

		<div data-page="container"> ..... </div>
```

Далее в описании приложения ( StateMap ) создать компонент контейнер указав его название и другие параметры:

```javascript

		var StateMap = {

					page: {                         //название компонента
						container: "page", 			//название контейнера
						props: [],					//массив свойств
						methods: {					//методы для свойств - обработчиков событий
						}			
					}
		}


//Теперь создадим экземпляр приложения :

		window.onload = function(){

			var HM = new HTMLixState(StateMap); 
		
			console.log(HM);
		}
```		

## Экземпляр приложения		


Теперь открыв консоль можно увидеть созданный экземпляр приложения.

В нем содержится несколько объектов это:

* `description` - описание приложения (обьект StsteMap);
* `eventProps` - обект для доступа пользовательским Emiter событиям;
* `state` - доступ ко всем компонентам приложения;
* `stateMethods` - общие методы для всего приложения;
* `stateProperties` - общие переменные для всего приложения;


Далее открыв обьект **state** в нем будет находиться наш компонент **page** кликнув по нему можно увидеть все остальные поля контейнера:

## Поля контейнера


* `htmlLink` - ссылка на Html обьект;
* `index` - порядковый номер контейнера в массиве, в нашем случае он равен **null** потому что не помещен в массив, а является компонентом;
* `methods` - методы контейнера;
* `name` - имя контейнера в нашем случае это "page";
*`pathToCоmponent` - имя компонента совпадает с именем контейнера, т.к. контейнер сам является компонентом (не помещен в массив);
* `props` - объект со свойствами (Prop) сейчас он пустой так как мы их еще не создали;
* `renderType` - тип контейнера "container-outer" говорит что контейнер является - компонентом, "container-inner" - что он в массиве; 
* `rootLink` - ссылка к корневому элементу (экземпляру приложения);
* `type` - "container" - тип объекта - контейнер (мы его указали в div элементе);

## Свойства контейнера


Свойства это объекты имеющие доступ к свойствам html страницы, также свойства могут быть слушателями событий. Для создания свойства необходимо указать его
имя после имени контейнера, а также указать тип данного свойства. Давайте создадим несколько свойств в контейнере page.



Название свойства в html идет после названия контейнера и знака "-"  (page-), в самом названии свойства знак "-" использовать нельзя.
Далее после знака = идет тип свойсва, у нас три разных типа это "text", "class" и "click".
Если тип свойства является событием то в описании приложения в объекте methods для данного свойства необходимо указать одноименный метод с обработчиком события.

```html
 <style type="text/css">
 
   .new_class { color: red; }
   
  </style>

<div data-page="container"> 

	<p data-page-paragraf="text" data-page-my_class="class">
		текст
	<p>
	
	<button data-page-btn_click="click">Кнопка</button>	
	
</div>
```

Далее в описании приложения:

```javascript 

		var StateMap = {

					page: {
						container: "page",
						
						
						
						props: ["paragraf", "my_class", "btn_click"],     //создали три свойства в контейнере page
						methods: {							
							
							btn_click: function(){                          //одноименный метод для свойства - события;
							
								console.log(this);							
								
								this.parent.props.paragraf.setProp("Новый текст");           //this.parent - доступ из конкретного свойства в контейнер со всеми свойствами
								
								this.parent.props.my_class.setProp("new_class");
							
							}
						}			
					}
		}


```

Итак мы создали три свойства одно из которых обработчик события "click".
this - в методе указывает на свойство к которому прикреплен данный обработчик - btn_click.
Далее с помощью .parent.props мы получаем доступ к контейнеру а далее ко всем свойствам контейнера, затем по имени свойства к конкретному свойству.
Метод **setProp** является универсальным и работает по разному в зависимости от типа свойств, для тима "text" он меняет некст, а для типа "class" он меняет класс.

После нажатия кнопки изменился текст и добавился новый класс. Далее давайте посмотрим в консоль.
После клика в ней появился обьект **Prop**.

## Prop

Свойство контейнера - находится в обьекте props;

* `events` - события для данного сойства;
* `htmlLink` - html ссылка на данное свойство;
* `parent` - сокращение от **parentContainer** - доступ к контейнеру из данного свойства;
* `pathToCоmponent` - имя компонента (не путать с именем контейнера т. к. они могут быть разными если компонент является массивом);
* `prop` - какие либо произвольные данные, по умолчанию null;
* `rootLink` - корневая ссылка на экземпляр приложения HTMLixState;
* `type`- тип свойства в данном случае это "click";

В зависимости от типа свойства здесь могут добавляться и различные другие параметры;


В каждом свойстве есть три основных метода это:

* `.setProp("Новые данные")` - добавляет либо изменяет данные свойства;
* `.getProp()` - получает данные свойства например свойство стипом "src" получит адрес ссылки;
* `.removeProp()` - удаляет данные из данного свойства, для каждого типа работает по разному, например для класса необходимо указать имя класса для удаления .removeProp("name_class") 

а также:

* `.component()` - возвращяет компонент, в котором находится свойство, если это контейнер то можно использовать .parent


# Массив

Далее давайте поместим наш контейнер в массив а также добавим в контейнер кнопку удаления.


```html

	<div data-pages="array"> /* создали массив pages и поместили в него два одинаковых контейнера page */
	
		<div data-page="container" style="border: 1px solid green"> 

			<p data-page-paragraf="text" data-page-my_class="class">текст<p>
			<button data-page-btn_click="click">Кнопка</button>	
			
			<button data-page-remove="click">Удалить</button> /* добавили кнопку удаления для контейнера page */
	
		</div>
		<div data-page="container" style="border: 1px solid green"> 

			<p data-page-paragraf="text" data-page-my_class="class">текст<p>
			<button data-page-btn_click="click">Кнопка</button>	
			
			<button data-page-remove="click">Удалить</button>
	
		</div>

	</div>		
	
```






 


