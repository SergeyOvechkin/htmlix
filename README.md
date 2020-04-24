


## Javascript Frontend Framework


**Htmlix** - яваскрипт фреймворк основанный на data- свойствах html документа. 

Особенности: 

* объектно-ориенитрованный подход построения приложения, наличие структуры и иерархии компонентов, 
* наличие пользовательских событий для обновления интерфейса и передачи данных между компонентами,
* создание приложения после отданной с сервера страници не отнимает время на загрузку компонентов и не требует серверного рендеринга,
* возможность строить приложения используя роутер и html шаблоны,
* строгая типизация свойств, значительно сокращает количество используемых методов и уменьшает объем кода требуемого для написания и запоминания.

## Создание приложения

Для создания приложения htmlix необходимо создать экземпляр **new HTMLixState( StateMap)** передав в него объект с описанием приложения  StateMap.
В описании приложения  StateMap находятся все компоненты, эмитеры событий, общие методы и переменные всего приложения, а таже другие настройки...


## Компоненты

Компонентами в **htmlix** выступают контейнеры и массивы. Контейнер это html элемент с различным набором свойств. 
Массив это html элемент который является хранилищем для однотипных контейнеров.
Свойство это обьект имеющий доступ к html данным например тексту или атрибуту, также свойство может быть слушателем события.

Все свойства имеют строго определенный тип данных, например "text" - текстовые данные, "src" -  src атрибут, также свойство может быть слушателем события.

**Контейнер** 


Для того чтобы создать контейнер необходимо указать его название и определить тип = "container" в html теге. Создадим контейнер page:

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


Открыв консоль можно увидеть созданный экземпляр приложения.

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
имя после имени контейнера, а также указать тип данного свойства. Давайте создадим несколько свойств: my_class, paragraf и btn_click в контейнере page:



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

Название свойства в html идет после названия контейнера и знака "-"  (page-), в самом названии свойства знак "-" использовать нельзя.
Далее после знака = идет тип свойсва, у нас три разных типа это "text", "class" и "click".
Если тип свойства является событием то в описании приложения в объекте methods для данного свойства необходимо указать одноименный метод с обработчиком события.


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

# Навигация по свойствам:

* Навигация по свойствам внутри одного общего контейнера как вы уже наверное заметили осуществляется с помощью `this.parent` - здесь this - 
указывает на свойство в обработчике события которого мы находимся, далее **parent** - это родительский контейнер. 

* `this.parent.props.name_prop` - так можно попасть из одного свойства в общем контейнере в другое, где props это все свойства какого либо контейнера.


* Если свойство расположено не в контейнере а в массиве то `parent` - указывает на массив в котором оно расположено. Перейти из массива в свойства контейнера можно будет так:

* `this.parent.data[index контейнера].props.имя_свойства`. Где data - это все созданные контейнеры в массиве.

* А из контейнера в массив в котором расположен контейнер `this.rootLink.state[this.pathToComponent]` либо вызвав this.component();

* Доступ к любому компоненту из любой точки приложения осуществляется  `this.rootLink.state["имя_компонента"]`

* Доступ сразу в массив из свойства контейнера (минуя контейнер) возможно так `this.component()`

* Напомню что компонентом может быть как массив так и самостоятельный контейнер, не помещенный в массив, поэтому вызов this.component() в контейнере не помещенном в массив просто вернет this

* Доступ к пользовательским событиям из любой точки осуществляется с помощью `this.rootLink.eventProps["emter-имя-события"]` далее getEventProp() или setEventProp(new_prop)

* Доступ к пользовательскому событию из метода подписчика осуществляется так: `this.emiter` далее getEventProp или setEventProp

* Названия пользовательских событий желательно начинать со слова "emiter".


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
		
				//так как мы удалили свойство listener_create_page из html кода и разделили событие "emiter-create-page" на два: 
				//"emiter-create-page" и "emiter-remove-page"
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


# Типы данных

Для создания любого свойства Prop необходимо в описании приложения либо в html коде указать тип данного свойства.
При инициализации приложение определит тип данного свойства и на основании его создаст объект Prop.
Если тип свойства является стандартным событием например "click", 'mouseup' и т. д., то к нему будет присоединен обработчик события который необходимо создать
в объекте method для данного контейнера в описании приложения.
Если тип свойства является пользовательским событием, то также как и для обычного события создается обработчик.
В обработчиках событий оператор this. указывает на данный конкретный экземпляр Prop, а далее с помощью навигации можно переходить к любым другим свойствам относительно данного.

Методы **setProp("newProp")**, **getProp()** и **removeProp()** работают по разному в зависимости от типа своства.


**Рассмотрим как работает метод getProp() для основных типов свойств:**

* "text" - текстовые данные - возвращает this.htmlLink.textContent;
* "inputvalue", "select" - данные форм возвращает - this.htmlLink.value;
* "checkbox", "radio" - чекбоксы и радио возвращает tru или false - this.htmlLink.checked;
* "class" - возвращает массив с классами this.htmlLink.classList;
* "render-variant" - возвращает текущий отображаемый объект this.renderChild;
* "group" - возвращает массив контейнеров из данной группы this.groupChild;
* 'href', 'src', "id" и другие атрибуты возвращает данный атрибут this.htmlLink.getAttribute(this.type);
* для событий обычно не используется, возвращает this.type;

тип **data** - т. к. в данных с типом дата после знака =  идут какие либо данные, то для создания данного типа после 
имени массива или контейнера пишется имя data а далее уже какие либо данные, например: data-page-data="какие либо данные",
здесь тип данных определяется по имени свойства оно всегда должно называться data после названия контейнера.

* "data" - возвращает this.htmlLink.dataset[ this.parent.name + "Data" ] тоесть данные после знака "=";

Методы **setProp("newProp")** и **removeProp()** работают аналогично, см. исходный код объектов Prop.prototype.removeProp, Prop.prototype.setProp


# Виртуальный массив

Виртуальный массив это массив в котором нет ссылки на html тег.
Он нужен для создания контейнеров не сгрупированных в одном html элементе а разбросаных по разным свойсвам group разных контейнеров.

Например у нас есть три контейнера и в каждом есть свойство с типом group

```html
<div data-pages=array>

	<div data-page="container">
		<div data-page-some_group="group">
		</div>
	</div>
	<div data-page="container">
		<div data-page-some_group="group">
		</div>
	</div>
	<div data-page="container">
		<div data-page-some_group="group">
		</div>
	</div>	
</div> 


```

```javscript
	
	var StateMap ={
			pages: {
				container: "page",
				props: ["some_group"],
				methods: {
				
				
				}			
			}				
	}

```

Теперь в каждом свойстве "some_group" мы хотим поместить различное количество пунктов меню data-item="container" например в первом 1, во втором 2, в третьем 3
если использовать обычные массивы то нам прийдется создать три одинаковых массива с различным набором data-item="container" и одинаковой функциональностью.
Чтобы этого не делать мы создадим один виртуальный массив items а его контейнеры мы распределим между свойствами "some_group"

Итак html код будет выглядеть так:

```html
<div data-pages=array>

	<div data-page="container">
		<div data-page-some_group="group">
		
			<div data-item="container" data-item-text="text">текст 1</div> <!-- добавили контейнер item -->
			
		</div>
	</div>
	<div data-page="container">
		<div data-page-some_group="group">
		
			<div data-item="container" data-item-text="text">текст 1</div>
			<div data-item="container" data-item-text="text">текст 2</div>
		
		</div>
	</div>
	<div data-page="container">
		<div data-page-some_group="group">
		
			<div data-item="container" data-item-text="text">текст 1</div>
			<div data-item="container" data-item-text="text">текст 2</div>
			<div data-item="container" data-item-text="text">текст 3</div>			
		
		</div>
	</div>	
</div> 


```

Теперь добавим виртуальный массив items в javascript код: 

```javscript
	
	var StateMap ={
			pages: {
				container: "page",
				props: ["some_group"],
				methods: {
				
				
				}			
			},
			
		virtualArrayComponents: {	//объект для хранения виртуальных массивов
		
			items: { //виртуальный массив
				container: "item", //контейнер виртуального массива
				props: ["text"],
				methods: {
				
				
				}			
			}
		}	
			
	}

```

Теперь открыв в консоли экземпляр приложения можно увидеть что всего в массиве state.items.data у нас 6 контейнеров "item",
а в свойстве  some_group.groupChild первого контейнера "page" - один, второго - два, третьего - три.

Таким образом с помощью свойства с типом "group" мы сгрупировали в трех контейнрах "page" массива "pages" различное количество контейнеров "item" из массива 'items'

Заметьте что index контейнера в массиве отличается от индекса контейнера в группе groupId
Теперь если мы захотим удалить контейнер из группы, с помощью метода .removeFromGroup(groupID) то он также удалится из виртуального массива.

# Group


Открыв в консоли свойство с типом "group" можно увидеть следующие поля:

* `groupArray` - ссылка на виртуальный массив контейнеров данной группы;
* `groupChild` - массив контейнеров из виртуального массива, порядковый номер совпадает с полем groupId конкретного контейнера группы.

Также у свойства с типом "group" имеются дополнительные методы:

* `.removeFromGroup(groupID)` - удаляетконтейнер из группы а также из виртуального массива, где groupID - индекс контейнера в группе;
* `.clearGroup()` -  удаляет все контейнеры из данного свойства а также из виртуального массива;
* `.addToGroup(container, insertLocation)` - добавляет контейнер в группу и создает в нем поля **.groupId** - индекс группы, **.groupParent** - ссылка на свойство в котором находится контейнер
где container - сам контейнер, insertLocation - позиция для всавки, если не указать то вставит в конец группы;


# Render-variant

Свойства с типом "render-variant" используются для отображения в себе одних и скрытия других компонентов;

Например у нас есть компонент page с кнопкой click и сойство variant с типом "render-variant",
а также еще два компонента variant1 и variant2


 
```html
<div data-page="container">
	<div data-page-variant="render-variant"> 
	
			<div data-variant1="container" data-variant1-style="style">текст первого варианта</div>
	
	</div>
	<button data-page-click="click">сменить вариант</button>
</div> 

<div data-variant2="container" data-variant2-style="style" style="display: none;">текст второго варианта<div>
```


```javscript
	
	var StateMap ={
			page: {
				container: "page",
				props: ["variant", "click"],
				methods: {
					
					click: function(){
					
						var variant = this.parent.props.variant; //получаем ссылку на свойство вариант из свойства click;
						
						console.log(variant);
						
						var newVariant = "variant2"; //имя нового компонента для отображения
						
						if(variant.renderChild.pathToCоmponent == "variant2") newVariant = "variant1" //если текущий компонент для отображения "variant2" меняем его на "variant1"

						variant.setProp(newVariant); //отображаем новый вариант
						
						variant.renderChild.props.style.setProp('dysplay: "" '); //убираем display none у скрытого варианта
					}
				
				}			
			},
			variant1: {
				container: "variant1",
				props: [],
				methods: {				
				}			
			},
			variant2: {
				container: "variant2",
				props: ["style"],
				methods: {				
				}			
			}			
			
	}

```

При построении реального приложения неотображаемые варианты обычно догружаются в fetch запросе поэтому их нет надобности скрывать с помощью стилей display none,
поэтому код переключения вариантов значительно меньше.

Итак посмотрим в консоли на свойство с типом render-variant в нем добавилось поле renderChild


* `renderChild` - ссылка на текущий компонент отображаемый в данном свойстве;

В отображаемом компоненте также добавилось поле renderParent

* `renderParent` - ссылка на свойство в котором отображается данный компонент;

Также у свойства с типом render-variant есть несколько дополнительных методов: 


* `.render(nameComponent)` - отображает компонент с именем "nameComponent";
* `.renderByContainer(containerLink)` - отображает компонент по ссылке;

В прочем можно также использовать .setProp(newContainer) - метод сам определит тип данных и затем вызовет нужный из них для текста .render, а для объекта .renderByContainer

**getProp()** - возвращает компонент который сейчас отображается,  а **removeProp()** - удаляет его, если это контейнер в массиве (renderType == "container-inner");

# Методы экземпляра приложения

Методы экземпляра приложения можно вызвать из любой точки this.rootLink.nameMethod();

* `.addContainer(stateNameProp, properties, insertLocation)` добавляет новый контейнер в компонент  stateNameProp с начальными свойствами properties, в указаную позицию insertLocation,
если не указать позицию, добавит - в конец, если не указать какое либо свойство в объекте  properties то возьмет данные из шаблона.

* `.removeAll(stateNameProp, widthChild)` - очищает массив stateNameProp, если указать widthChild=true удалит все дочерние компоненты со свойств с типами group и render-variant

* `.removeByIndexes(stateNameProp, indexArray, widthChild )` - удаляет несколько контейнеров indexArray=[] из массива  stateNameProp;

* `.removeByIndex(stateNameProp, index, widthChild )` - удаляет один контейнер из массива stateNameProp по индексу index;
  

**htmlix** - находится в стадии тестирования, поэтому не исключена возможность возникновения непредвиденных ошибок, однако несмотря на это, его уже сейчас можно использовать в небольших и средних проектах.

Вопросы и предложения можно отправлять на адрес: maksaev.mikhail@inbox.ru



