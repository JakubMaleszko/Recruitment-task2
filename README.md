# Zadanie

Przeczytaj uważnie instrukcję i odeślij nam link z rozwiązaniem.

### Specyfikacja

Chcielibyśmy, abyś stworzył dla nas prosty interfejs REST API - podstawową bazę danych filmów współpracującą z zewnętrznym interfejsem API. Oto pełna specyfikacja punktów końcowych, które chcielibyśmy mieć:

* `POST /movies`:
  * Treść żądania powinna zawierać tylko tytuł filmu, a jego obecność powinna zostać zweryfikowana.
  * Na podstawie przekazanego tytułu, inne szczegóły filmu należy pobrać z http://www.omdbapi.com/ (lub innej podobnej, publicznej bazy danych filmów) - i zapisać w bazie danych aplikacji.
  * Odpowiedź na żądanie powinna zawierać pełny obiekt filmowy wraz ze wszystkimi danymi pobranymi z zewnętrznego interfejsu API.
* `GET /movies`:
  * Powinien pobrać listę wszystkich filmów już obecnych w bazie danych aplikacji.
  * Dodatkowe filtrowanie, sortowanie jest w pełni opcjonalne - ale niektóre implementacje są bonusem.
* `POST /comments`:
  * Treść żądania powinna zawierać identyfikator filmu już znajdującego się w bazie danych oraz treść komentarza.
  * Komentarz należy zapisać w bazie danych aplikacji i zwrócić w odpowiedzi na żądanie.
* `GET /comments`:
  * Powinien pobrać listę wszystkich komentarzy obecnych w bazie danych aplikacji.
  * Powinien umożliwiać filtrowanie komentarzy według powiązanego filmu, poprzez przekazanie jego identyfikatora.

### Zasady i wskazówki

* Zachęcamy do korzystania z najnowszego standardu i funkcji ECMAScript.
* Możesz napisać swoje rozwiązanie przy użyciu wybranego frameworka, bibliotek i bazy danych - mile widziane jest podzielenie się uzasadnieniem ich wyboru!
* Przynajmniej podstawowe testy punktów końcowych i ich funkcjonalności są obowiązkowe. Ich dokładny zakres i formę pozostawiamy Tobie.
* Kod aplikacji powinien być przechowywany w publicznym repozytorium, abyśmy mogli go przeczytać, pobrać i zbudować samodzielnie. Pamiętaj, aby dołączyć plik README lub przynajmniej podstawowe uwagi dotyczące wymagań i konfiguracji aplikacji - powinniśmy być w stanie łatwo i szybko ją uruchomić.
* Aplikacja musi być hostowana i publicznie dostępna dla nas online - polecamy [Heroku](https://heroku.com).

**Powodzenia!**