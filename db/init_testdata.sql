-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: mysql
-- Létrehozás ideje: 2024. Júl 25. 18:32
-- Kiszolgáló verziója: 9.0.0
-- PHP verzió: 8.2.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `vacchuncc`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ATCOs`
--

CREATE TABLE `ATCOs` (
  `initial` varchar(2) NOT NULL,
  `CID` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `trainee` tinyint(1) DEFAULT NULL,
  `isInstructor` tinyint(1) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `ATCOs`
--

INSERT INTO `ATCOs` (`initial`, `CID`, `name`, `trainee`, `isInstructor`, `isAdmin`) VALUES
('BB', 123456, 'Bozi Bence', 0, 0, 1),
('CS', 1582533, 'Csörgő Csaba', 0, 0, 0),
('JN', 1582534, 'Jenei Ákos', 0, 0, 1),
('TE', 10000010, 'Web Ten', 0, 0, 1),
('UJ', 156874, 'Ujhelyi Domonkos', 0, 0, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `atcTrainingBookings`
--

CREATE TABLE `atcTrainingBookings` (
  `id` int NOT NULL,
  `instructorName` varchar(100) NOT NULL,
  `instructiorInitial` varchar(2) NOT NULL,
  `traineeName` varchar(100) NOT NULL,
  `traineeInitial` varchar(2) NOT NULL,
  `startTime` datetime(6) NOT NULL,
  `endTime` datetime(6) NOT NULL,
  `position` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `controllerBookings`
--

CREATE TABLE `controllerBookings` (
  `id` int NOT NULL,
  `initial` varchar(2) NOT NULL,
  `cid` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `startTime` datetime(6) NOT NULL,
  `endTime` datetime(6) NOT NULL,
  `sector` varchar(15) NOT NULL,
  `subSector` varchar(15) NOT NULL,
  `training` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sectorisationCodes`
--

CREATE TABLE `sectorisationCodes` (
  `id` varchar(10) NOT NULL,
  `requiredSectors` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `sectorisationCodes`
--

INSERT INTO `sectorisationCodes` (`id`, `requiredSectors`) VALUES
('2A', '[\"EL\", \"WL\"]');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sectors`
--

CREATE TABLE `sectors` (
  `id` varchar(6) NOT NULL,
  `minRating` int NOT NULL,
  `childElements` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `sectors`
--

INSERT INTO `sectors` (`id`, `minRating`, `childElements`) VALUES
('ADC', 3, '[\"ADC\"]'),
('CDC', 2, '[\"CDC\"]'),
('CTR EC', 5, '[\"EC\"]'),
('CTR PC', 5, '[\"PC\"]'),
('EH', 5, '[\"EC\", \"PC\"]'),
('EL', 5, '[\"EC\", \"PC\"]'),
('EU', 5, '[\"EC\", \"PC\"]'),
('FMP', 4, '[\"FM\"]'),
('GRC', 2, '[\"GRC\"]'),
('L EC', 5, '[\"EC\"]'),
('SV', 4, '[\"SV\"]'),
('SV1', 5, '[\"SV\"]'),
('TD', 4, '[\"EC\"]'),
('TPC', 2, '[\"TPC\"]'),
('TRE/L', 4, '[\"EC\", \"PC\"]'),
('TRE/U', 4, '[\"EC\", \"PC\"]'),
('WH', 5, '[\"EC\", \"PC\"]'),
('WL', 5, '[\"EC\", \"PC\"]'),
('WU', 5, '[\"EC\", \"PC\"]');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `ATCOs`
--
ALTER TABLE `ATCOs`
  ADD PRIMARY KEY (`initial`);

--
-- A tábla indexei `atcTrainingBookings`
--
ALTER TABLE `atcTrainingBookings`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- A tábla indexei `controllerBookings`
--
ALTER TABLE `controllerBookings`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `sectorisationCodes`
--
ALTER TABLE `sectorisationCodes`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `sectors`
--
ALTER TABLE `sectors`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `atcTrainingBookings`
--
ALTER TABLE `atcTrainingBookings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `controllerBookings`
--
ALTER TABLE `controllerBookings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;