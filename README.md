Entwicklung von Webapplikationen Dr. Hui Shi Übung 4
Clara Correa Osterburg,
Saskia Juergens,
Kristina-Marie Soldin

Entwicklung eines Online-Memory-Spiels


Datenbank

- Damit die Webapplikation funktioniert, muss der/die Nutzer/in zunächst die
mitgelieferte Datenbank in Xampp hochladen. Die Daten werden in pHpMyAdmin
unter omemory gespeichert.
- Es gibt verschiedene Tabellen, in denen alles gespeichert wird: karte, level,
messages, Spiel, spieler. Die Daten müssen dort gespeichert werden, damit unsere
Webapplikation darauf zugreifen kann.
- Speichere die das Dateisytem in dem htdocs Ordner deines Xampp Ordners.
- Öffne die Webseite über localhost/.. (Dateipfad ab dem HTdocs Ordner)


Website

- Öffnet man unsere Website startet man beim Startscreen, von dort aus hat man die
Möglichkeit mithilfe der Navbar auf verschiedene Unterseiten zu wechseln.
- Zunächst muss der/die Spieler/in sich auf der Seite Login einloggen beziehungsweise registrieren, falls er/sie noch kein Spielkonto angelegt hat. Hierzu
findet man auf der Login Seite einen Link zur Registrierungsseite.
- Ist der/die Spieler/in eingeloggt, wird ihm/ihr sein/ihr Profil auf der Seite Mein Profil
angezeigt, dort hat er die Möglichkeit seine Daten anzuschauen und sich
auszuloggen, sowie sein Konto und die dazugehörigen Spiele zu löschen
- Drückt man auf den Knopf „Zu meinen Spielen“ wird dem/der Spieler/in eine Tabelle
und ein Diagramm mit all seinen/ihren Spielverläufen angezeigt. Zudem hat der/die
Spieler/in die Möglichkeit sein/ihr Spielkonto zu löschen oder seine/ ihre Daten zu
bearbeiten. Beim Bearbeiten öffnet sich nach dem Knopfdruck ein neues Fenster, in
dem der/die Spieler/in seine/ihre Daten ändern kann. Die neuen Daten werden aber
noch nicht in der Datenbank gespeichert.
- Geht der/die Spieler/in nun auf die Spielseite, kann das Spiel gestartet werden,
stoppt der/die Spieler/in das Spiel gilt es als abgebrochen. Läuft die Zeit ab bevor
der/die Spieler/in alle Karten aufgedeckt hat, gilt es als verloren.
- Nach jedem dritten gewonnenen Spiel in einem Level steigt der/die Spieler/in ein
Level auf.
- Man kann eine Anfrage für ein Spiel mit zwei Personen schicken, aber bekommt
noch keine Antwort, sodass das Spiel selber dann funktioniert.
- Ist der Admin angemeldet, kann dieser neue Karten und Spiellevel hinzufügen oder
löschen, ein/e normaler Nutzer/in kann sich nur alle Spiellevels und Karten anzeigen
lassen.
- Der Admin findet diese Funktion in der Navbar, bei Spieleinstellungen und dem
Unterpunkt Spieleinstellungen. Unter dem Punkt Spielinhalt User werden alle
Registrierten Spieler/innen angezeigt, unter Spielinhalt verwalten werden alle
Spieler/innen, Karten und Level angezeigt.


Hinweise:


- es ist noch nicht möglich im Double Spiel eine Antwort zu schicken.
- In der Datenbank befindet sich ein SPieler mit der Nummer 0. Dieser ist notwendig
für die Spiellogik, ist aber kein Spieler der genutzt werden kann.