


## Javascript Frontend Framework


**Htmlix** - яваскрипт фреймворк основаный на data- свойствах html документа. 

## Создание приложения

Для создания приложения htmlix необходимо создать экземпляр **new HTMLixState( StateMap)** передав в него объект с описанием приложения  StateMap.
В описании приложения  StateMap находятся все компоненты, эмитеры событий, общие методы и переменные всего приложения, а таже другие настройки...


## Компоненты

Компонентами в **htmlix** выступают контейнеры и массивы. Контейнер это html элемент с различным набором свойств. 
Массив это html элемент который является хранилищем для однотипных контейнеров.
Свойство это обьект имеющий доступ к html данным например тексту или атрибуту, также свойство может быть слушателем события.

**Контейнер** 


Для того чтобы создать контейнер необходимо указать его название и определить тип "container" в html теге. Создадим контейнер page:

```html

<div data-page="container"> ..... </div>
```

Далее в описании приложения ( StateMap ) создать компонент контейнер указав его название и другие параметры:

```javascript

var StateMap = {

		page: {                  //название компонента
			container: "page", 	//название контейнера
			props: [],		   //массив свойств
			methods: {		  //методы для свойств - обработчиков событий
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

* `description` - описание приложения (обьект StateMap);
* `eventProps` - обект для доступа к пользовательским Emiter событиям;
* `state` - доступ ко всем компонентам приложения;
* `stateMethods` - общие методы для всего приложения;
* `stateProperties` - общие переменные для всего приложения;


Далее открыв обьект **state** в нем будет находиться наш компонент **page** кликнув по нему можно увидеть все остальные поля контейнера:

## Поля контейнера

* `htmlLink` - ссылка на Html обьект;
* `index` - порядковый номер контейнера в массиве, в нашем случае он равен **null** потому что он не помещен в массив, а является компонентом;
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

	<p data-page-paragraf="text" data-page-my_class="class"> //свойство paragraf с типом "text" и my_class с типом "class"
		текст
	<p>
	
	<button data-page-btn_click="click">Кнопка</button>	 //btn_click - свойство - слушательсобытия "click" 
	
</div>
```

Далее в описании приложения:

```javascript 

var StateMap = {

	page: {
		container: "page",
												
			props: ["paragraf", "my_class", "btn_click"],  //создали три свойства в контейнере page
			methods: {							
							
				btn_click: function(){   //одноименный метод для свойства - события;
							
					console.log(this);							
								
					this.parent.props.paragraf.setProp("Новый текст");
					//this.parent - доступ из конкретного свойства в контейнер 
								
					this.parent.props.my_class.setProp("new_class");
							
				}
			}			
	}
}


```

Итак мы создали три свойства одно из которых обработчик события "click".
this - в методе указывает на свойство к которому прикреплен данный обработчик - btn_click.
Далее с помощью .parent.props мы получаем доступ к контейнеру а далее ко всем свойствам контейнера, затем по имени свойства к конкретному свойству.
Метод **setProp** является универсальным и работает по разному в зависимости от типа свойств, для тима "text" он меняет некст, а для типа "class" он добавляет класс.

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

В зависимости от типа свойства здесь могут добавляться и различные другие поля;


В каждом свойстве есть три основных метода это:

* `.setProp("Новые данные")` - добавляет либо изменяет данные свойства;
* `.getProp()` - получает данные свойства например свойство с типом "src" получит адрес ссылки;
* `.removeProp()` - удаляет данные из данного свойства, для каждого типа работает по разному, например для класса необходимо указать имя класса для удаления .removeProp("name_class") 

а также:

* `.component()` - возвращяет компонент, в котором находится свойство, если это контейнер то можно использовать .parent


# Массив

Далее давайте поместим наш контейнер в массив а также добавим в контейнер кнопку удаления.


```html
<div data-pages="array" style="border: 1px solid red; padding: 10px;">
<!-- создали массив pages и поместили в него два одинаковых контейнера page --> 
	
	<div data-page="container" style="border: 1px solid green"> 

		<p data-page-paragraf="text" data-page-my_class="class">текст<p>
		<button data-page-btn_click="click">Кнопка</button>	
			
		<button data-page-remove="click">Удалить</button> 
		<!-- добавили кнопку удаления для контейнера page -->
	
	</div>
	<div data-page="container" style="border: 1px solid green"> 

		<p data-page-paragraf="text" data-page-my_class="class">текст<p>
		<button data-page-btn_click="click">Кнопка</button>	
			
		<button data-page-remove="click">Удалить</button>
	
	</div>

</div>		
	
```

Тперь изменим описание приложения:

```javascript

var StateMap = {

  pages: { //теперь компонент называется pages 
					
	container: "page", //названия контейнеров не поменялись
						
												
	props: ["paragraf", "my_class", "btn_click", "remove"], //добавили свойство "remove"
	methods: {							
							
		btn_click: function(){                       
							
			console.log(this);															
			this.parent.props.paragraf.setProp("Новый текст");  							
			this.parent.props.my_class.setProp("new_class");
							
		},
		remove: function(){  //обработчик события для свойства "remove"
							
			this.parent.remove(); //получаем доступ к контейнеру из свойства, а затем удаляем контейнер 
							
		}
	}			
 }
}
```

Итак после того как мы поместили контейнер в массив pages компонент принял название массива, а названия для контейнеров остались прежними;
Также теперь контейнер можно удалить т. к. он находится в массиве.

Давайте откроем консоль в ней экземпляр приложения и перейдем по навигации state.pages к компоненту pages и рассмотрим его поля:


#Поля массива

* `data` - содержит все контейнеры массива, порядковый номер контейнера в массиве совпадает с полем index контейнера, после добавления или удаления контейнера из массива
индекс других смежных контейнеров может измениться;
* `htmlLink` - html ссылка на массив;
* `index` - null для массива;
* `pathToComponent` - название компонента (pages);
* `renderType` - тип отображения  "array"  также может быть "virtual-array" для виртуального массива;
* `rootLink` - ссылка на корневой объект;
* `selector` - уточняющий селектор для поиска контейнеров относительно тега массива, например "div:last-of-tipe" - будет искать последний div внутри <div data-pages="array">
* `templateData` - шаблон для создания нового контейнера для данного массива, берется первый из массива, если указать тип контейнера "template", то при инициализации делается с него копия, а он затем удаляется из массива;
* `type` - тип "array";


Давайте теперь изменим текст первого контейнера нажав на "кнопку" а затем удалим его нажав на кнопку "удалить", нулевой контейнер удалится, а первый поменяет индекс на ноль
таким образом порядок в массиве сохранится. Теперь если прейти по навигации pages.data[0].index будет равным "0" в то время как до удаления нулувого контейнера он был равен "1";


Теперь рассмотрим методы контейнера:

# Методы контейнера Container

* `component()` - возвращает компонент для данного контейнера если он в массиве то вернет массив (pages), если контейнер сам является компонентом то вернет this.
* `remove(withChild)` - удаляет контейнер, если передать параметром whithChild=true удаляет также дочерние контейнеры, находящиеся в свойствах с типами: "group" и "render-variant"
* `setAllProps(props)` - проверяет обект props на наличие совпадающих ключей со свойствами контейнера и устанавливает их значение для всех совпавших;



 Далее рассмотрим динамическое создание новых контейнеров page в массиве pages.
 Для этого создадим новый компонент - форму в которой будем создавать новые контейнеры:
 
 ```html
 <!-- создали новый компонент create_page -->
<form data-create_page="container" style="border: 1px solid blue; padding: 10px; margin: 10px;">  
			
	<div class="form-group">
		<label for="container_text">текст записи</label>
		
			<textarea data-create_page-text="inputvalue"  name="container_text" id="container_text" rows="1"></textarea> 
			<!-- свойство text с типом данных "inputvalue"  -->
			
		</div>
			
		<button data-create_page-create="click">Создать</button> 
		<!-- свойство create с типом данных "click"  -->
		
</form>
		
<div data-pages="array" style="border: 1px solid red; padding: 10px;">
	<!-- массив pages без изменений -->
</div>
		
 ```
 
Теперь создадим новый компонент в описании приложения:


```javascript

var StateMap = {
					
	create_page: { // добавили новый компонент create_page 
		container: "create_page",  // имя контейнера совпадает с именем компонента, так как сам контейнер является компонентом 
		props: ["text", "create"], // добавили два свойства 
		methods: {
			create: function(){ // для свойства- события добавили одноименный обработчик 
											
				event.preventDefault(); // отменяем перезагрузку страници 
											
				var text = this.parent.props.text.getProp(); 
				// получаем данные свойства находящегося в том же контейнере
											
				this.rootLink.state["pages"].add({paragraf: text});  
				// создаем новый контейнер page в компоненте pages с полученными данными формы				
			}						
		}
	},
	pages: {
			<!-- компонент pages без изменений -->
	}
}
```

Итак мы создали компонет create_page для создания новых страниц page c помощью метода массива **.add()**.
Давайте более подробно разберем метод .add() а также другие методы массива:

# Методы массива HTMLixArray 

* `.add(props, insertLocation)` - создает новый контейнер со свойствами props в указанной позиции "insertLocation" в массиве, если не указать позицию то создаст контейнер в конце массива;
* `.removeIndex(indexArray, widthChild)` - удаляет несколько контейнеров из массива, indexArray - массив с индексами контейнеров для удаления, widthChild - если передать параметром whithChild=true удаляет также дочерние контейнеры, находящиеся в свойствах с типами: "group" и "render-variant";
* `.removeAll( widthChild)` - удаляет все контейнеры из массива,  widthChild - если передать параметром whithChild=true удаляет также дочерние контейнеры, находящиеся в свойствах с типами: "group" и "render-variant";


# Пользовательские события 

Пользовательское событие это событие начинающееся со слова "emiter-" они нужны для создания динамических переменных, чтобы слушатели обновляли свой интерфейс на основе новых данных.
Итак в нашем компоненте pages постоянно создаются и удаляются новые контейнеры, соответственно их index постоянно меняется, давайте создадим событие "emiter-create-page", которое будут 
слушать все контейнеры page и обновлять свое свойство page_index которое мы также создадим;


Добавим в html код контейнеров "page" свойство - событие  listener_create_page с названием события "emiter-create-page" и свойство page_index с типом "text":


```html

<form data-create_page="container" style="border: 1px solid blue; padding: 10px; margin: 10px;> <!-- ...без изменений... --> </form>

<div data-pages="array" style="border: 1px solid red; padding: 10px;"> 
	
	<div data-page="container" data-page-listener_create_page="emiter-create-page" style="border: 1px solid green"> 
	<!-- добавили свойство - слушателя события "emiter-create-page" -->
	
		<p data-page-paragraf="text" data-page-my_class="class">текст<p>
			
		<p>index= <span data-page-page_index="text" > 0</span> </p> 
		<!-- добавили свойство page_index для отображения меняющихся данных -->
			
		<button data-page-btn_click="click">Кнопка</button>				
		<button data-page-remove="click">Удалить</button> 
	
	</div>
	<!-- аналогично и для второго контейнера -->
	<div data-page="container" data-page-listener_create_page="emiter-create-page" style="border: 1px solid green"> 
		
		<p data-page-paragraf="text" data-page-my_class="class">текст<p>			
		<p>index= <span data-page-page_index="text" > 1</span> </p> 		
		<button data-page-btn_click="click">Кнопка</button>				
		<button data-page-remove="click">Удалить</button>
	
	</div>
</div>		
	
```


Теперь изменим описание приложения:


```javascript

var StateMap = {
					
	create_page: { 
		container: "create_page", 
		props: ["text", "create"], 
		methods: {
			create: function(){ 
											
					event.preventDefault(); 
											
					var text = this.parent.props.text.getProp();  
											
					this.rootLink.state["pages"].add({paragraf: text}); 
											
					this.rootLink.eventProps["emiter-create-page"].emit();
					//вызвали пользовательское событие "emiter-create-page"	при создании контейнера	
					}						
				}
	},
```
```	javascript
	pages: {  					
		container: "page", 	
		//добавили свойства "page_index" и "listener_create_page"
		props: ["paragraf", "my_class", "btn_click", "remove", "page_index", "listener_create_page"], 
			methods: {							
							
				btn_click: function(){                       
							
					console.log(this);															
					this.parent.props.paragraf.setProp("Новый текст");  							
					this.parent.props.my_class.setProp("new_class");
							
				},
				remove: function(){ 		
							
					this.parent.remove();
					this.rootLink.eventProps["emiter-create-page"].emit(); 
					//вызвали пользовательское событие "emiter-create-page" при удалении контейнера
							
				},
				// добавили обработчик события "emiter-create-page" для свойства listener_create_page всех контейнеров
				listener_create_page: function(){ 
									
					this.parent.props.page_index.setProp( this.parent.index );
					 //обновили интерфейс всех контейнеров на основе меняющегося index		
				}
			}			
	},
	eventEmiters: {  //создали объект со всеми пользовательскими событиями приложения
					
			["emiter-create-page"]: { //наше событие с начальными данными
							
					prop: "",
			}
	}
}
```

Итак после каждого создания либо удаления контейнера page мы вызываем событие "emiter-create-page" и все подписчики обновляют свои данные;
Теперь если создать новый контейнер он получит индек равный 2, азатем удалить нулевой контейнер с инедексом 0 то созданный нами контейнер изменит индекс с 2 на 1 и мы с помощью пользовательского события обновим его интерфейс.
Также можно передавать новые данные в пользовательское событие которые затем получат все слушатели, давайте разберем подробнее все методы объекта eventProps["emiter-name"]


# Методы пользовательских событий

Доступ из любой точки приложения осуществляется по имени пользовательского события: 
this.rootLink.eventProps["emiter-имя-события"]

* `.emit()` - вызывает событие для всех слушателей;
* `.setEventProp("новые данные")` - вызывает событие для всех слушателей и меняет переменную this.rootLink.eventProps["emiter-имя-события"].prop на новые данные,
получить новые данные в слушателе события можно с помощью this.emiter.prop или this.emiter.getEventProp();
* `.getEventProp()` - получает данные пользовательского события;


Слушателями пользовательских событий могут быть, как свойства Prop контейнера Container, так и свойства Массива Array;

# Свойства Массива Array

Массив кроме того что содержит в себе набор однотипных контейнеров, также может содержать в себе и различные свойства.
В html коде они создаются также как и для контейнера, только в место имени контейнера идет имя массива а затем имя свойства после знака "-",
однако не обязательно создавать все свойства в html коде, можно создать их в описании приложения и указать селектор для их поиска в html, как мы и зделаем далее.


В html коде удалим data-page-listener_create_page="emiter-create-page" со всех контейнеров, теперь мы по другому будем указывать свойства с пользовательскими событиями.

Так как контейнеры "page" у нас также являются слушателями событий "emiter-create-page", мы разделим событие "emiter-create-page" на два : "emiter-create-page" и "emiter-remove-page". 
Контейнеры page массива pages будут слушать события "emiter-remove-page" и "emiter-create-page" для обновления интерфейса, 
а сам массив только "emiter-create-page" для создания новых контейнеров.




```javascript

var StateMap = {
					
	create_page: { 
		container: "create_page", 
		props: ["text", "create"], 
		methods: {
			create: function(){ 
											
					event.preventDefault(); 
											
					var text = this.parent.props.text.getProp();  
											
					//удалили создание контейнера в компоненте create_page
											
					this.rootLink.eventProps["emiter-create-page"].setEventProp(text);					
					//заменили .emit() на .setEventProp(text) чтобы передать данные в событие
					}						
				}
	},
```
Теперь мы в пользовательское событие передаем данные формы а массив pages будет слушателем события ["emiter-create-page"] и при его наступлении создаст новый контейнер

Давайте создадим свойство listener_create_page однако теперь уже не в контейнере а в массиве:

```	javascript
	pages: {
		arrayProps: [  ["listener_create_page", "emiter-create-page", ""] ],
		
		/** теперь свойство это - массив где первым идет название свойства, 
		вторым тип свойства, а третьим селектор для поиска свойства относительно массива,
		если оставить селектор пустым "" то приложение просто возьмет тот-же тег 
		что и у массива pages - data-pages="array".
		теперь свойство "listener_create_page"  не обязательно обозначать в html коде. 
		Так можно писать любые свойства, не только пользовательские события **/
		
		arrayMethods: {
		
			//далее обработчик события для свойства "listener_create_page"
			listener_create_page: function(){
			
					//здесь мы из свойства переходим в компонент - массив pages и вызываем метод .add() 
					//передав в него начальные данные для свойств paragraf и page_index
					
					this.parent.add({paragraf: this.emiter.getEventProp(),  page_index: 0 }, 0);
					//теперь мы добавляем контейнер не в конец а в начало массива указав вторым параметром 0
			}
				 
		
		},
		container: "page", 	
		

		
		props: [	"paragraf", "my_class", "btn_click", "remove", "page_index", 
		
					//так как мы удалили свойство listener_create_page из html кода и разделили событие "emiter-create-page" на два:  "emiter-create-page" и "emiter-remove-page"
					//добавляем их с помощью двух массивов указав селектор "" для поиска относительно контейнера 
					
					["listener_create_page", "emiter-create-page", ""], ["listener_remove_page", "emiter-remove-page", ""] 
				
				],

		
			methods: {							
							
				btn_click: function(){                       
							
					console.log(this);															
					this.parent.props.paragraf.setProp("Новый текст");  							
					this.parent.props.my_class.setProp("new_class");
							
				},
				remove: function(){ 		
							
					this.parent.remove();
					this.rootLink.eventProps["emiter-remove-page"].emit(); 
					
							
				},
				listener_create_page: function(){ 
									
					this.parent.props.page_index.setProp( this.parent.index );
					 		
				},
				listener_remove_page: function(){ //добавили обработчик для события "emiter-remove-page" аналогичный предыдущему 
									
					this.parent.props.page_index.setProp( this.parent.index );
					 		
				}
			}			
	},
	eventEmiters: { 
					
			["emiter-create-page"]: { 
							
					prop: "",
			},
			["emiter-remove-page"]: { //новое событие "emiter-remove-page"
							
					prop: "",
			}
	}
}
```


Итак теперь у нас есть два события "emiter-create-page" и "emiter-remove-page" массив pages слушает  "emiter-create-page" и создает новые контейнеры при его наступлении, 
а его контейнеры page слушают оба события и обновляют свой интерфейс (page_index) при наступлении любого из них.

Это была основная информация о построении приложения на htmlix;

# Дополнительные уроки

Дополнительные уроки можно почитать по следующим ссылкам:

* <a href="https://github.com/SergeyOvechkin/htmlix/wiki/1.-%D0%A3%D1%80%D0%BE%D0%BA-%E2%84%961---%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%D0%B3%D0%BE-%D0%BC%D0%B5%D0%BD%D1%8E.">Виртуальные массивы - создание простого меню</a>
* <a href="https://github.com/SergeyOvechkin/htmlix/wiki/1.1-%D0%A3%D1%80%D0%BE%D0%BA-%E2%84%961.1-%D0%B4%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D1%81%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0-%D1%81%D0%B2%D0%BE%D0%B9%D1%81%D1%82%D0%B2-%D0%B2-%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%B9%D0%BD%D0%B5%D1%80%D0%B5,-%D1%81%D0%BC%D0%B5%D1%88%D0%B0%D0%BD%D0%BD%D0%BE%D0%B5-%D0%BC%D0%B5%D0%BD%D1%8E.">Селекторы для поиска свойства относительно контейнера - создание смешанного меню</a>











 


