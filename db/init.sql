-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: mysql
-- Létrehozás ideje: 2023. Nov 25. 18:54
-- Kiszolgáló verziója: 8.2.0
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `webutils`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `invitecodes`
--

CREATE TABLE `invitecodes` (
  `id` int NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` int NOT NULL,
  `note` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `createdBy` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `usedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `shortlinks`
--

CREATE TABLE `shortlinks` (
  `id` int NOT NULL,
  `shortForm` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `createdBy` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `useCount` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `role` int NOT NULL,
  `note` varchar(300) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `invitecodes`
--
ALTER TABLE `invitecodes`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `shortlinks`
--
ALTER TABLE `shortlinks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `shortForm` (`shortForm`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `invitecodes`
--
ALTER TABLE `invitecodes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `shortlinks`
--
ALTER TABLE `shortlinks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
