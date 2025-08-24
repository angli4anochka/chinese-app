# 🚀 Инструкция по деплою на GitHub Pages

## Шаг 1: Создание репозитория на GitHub

1. Зайдите на GitHub: https://github.com
2. Нажмите кнопку "New" или "+" → "New repository"
3. Введите название репозитория: `chinese-vocabulary-trainer`
4. Оставьте репозиторий публичным (Public)
5. НЕ добавляйте README, .gitignore или лицензию
6. Нажмите "Create repository"

## Шаг 2: Подключение локального репозитория к GitHub

Выполните эти команды в терминале в папке проекта:

```bash
# Переход в папку проекта
cd /mnt/c/Users/angli/chinese-book-trainer-project/chinese-book-trainer/chinese-vocabulary-trainer

# Добавление всех файлов в git
git add .

# Создание первого коммита
git commit -m "Initial commit: Chinese Vocabulary Trainer React App"

# Переименование ветки в main (если нужно)
git branch -M main

# Подключение к вашему репозиторию на GitHub
# ЗАМЕНИТЕ angli4anochka на ваш username на GitHub!
git remote add origin https://github.com/angli4anochka/chinese-vocabulary-trainer.git

# Отправка кода на GitHub
git push -u origin main
```

## Шаг 3: Установка gh-pages

```bash
# Установка пакета gh-pages для деплоя
npm install --save-dev gh-pages
```

## Шаг 4: Деплой на GitHub Pages

```bash
# Сборка и деплой приложения
npm run deploy
```

Эта команда:
1. Соберет оптимизированную версию приложения
2. Создаст ветку `gh-pages` в репозитории
3. Загрузит собранные файлы в эту ветку
4. Настроит GitHub Pages автоматически

## Шаг 5: Проверка деплоя

После успешного деплоя:
1. Зайдите в Settings вашего репозитория на GitHub
2. Прокрутите до раздела "Pages"
3. Вы увидите сообщение: "Your site is published at https://angli4anochka.github.io/chinese-vocabulary-trainer"
4. Откройте эту ссылку - ваше приложение работает!

## 📝 Полезные команды

### Обновление приложения
После внесения изменений:
```bash
git add .
git commit -m "Описание изменений"
git push
npm run deploy
```

### Если нужно изменить homepage
Отредактируйте в `package.json`:
```json
"homepage": "https://ВАШ_USERNAME.github.io/ИМЯ_РЕПОЗИТОРИЯ"
```

### Проблемы с деплоем?

1. **Ошибка авторизации**: Убедитесь, что вы залогинены в git:
```bash
git config --global user.name "Ваше имя"
git config --global user.email "ваша@почта.com"
```

2. **Ошибка "remote origin already exists"**:
```bash
git remote remove origin
git remote add origin https://github.com/ВАШ_USERNAME/chinese-vocabulary-trainer.git
```

3. **Приложение не отображается**: Подождите 5-10 минут после деплоя

## 🎉 Готово!

Ваше приложение теперь доступно по адресу:
https://angli4anochka.github.io/chinese-vocabulary-trainer

Не забудьте поменять `angli4anochka` на ваш GitHub username!