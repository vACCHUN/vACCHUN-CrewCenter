-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: mysql
-- Létrehozás ideje: 2024. Júl 28. 11:41
-- Kiszolgáló verziója: 9.0.0
-- PHP verzió: 8.2.20

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
  `id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `requiredSectors` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `sectorisationCodes`
--

INSERT INTO `sectorisationCodes` (`id`, `requiredSectors`) VALUES
('1', '[{\"sector\": \"FMP\", \"subSector\": \"any\"}]'),
('ADC', '[{\"sector\": \"ADC\", \"subSector\": \"any\"}]'),
('APP1', '[{\"sector\": \"TRE/L\", \"subSector\": \"EC\"}]'),
('APP2', '[{\"sector\": \"TRE/L\", \"subSector\": \"EC\"}, {\"sector\": \"TRE/L\", \"subSector\": \"PC\"}]'),
('APP3', '[{\"sector\": \"TRE/L\", \"subSector\": \"any\"}, {\"sector\": \"TD\", \"subSector\": \"any\"}]'),
('APP4', '[{\"sector\": \"TRE/L\", \"subSector\": \"any\"}, {\"sector\": \"TRW/U\", \"subSector\": \"any\"}]'),
('APP5', '[{\"sector\": \"TRE/L\", \"subSector\": \"any\"}, {\"sector\": \"TRW/U\", \"subSector\": \"any\"}, {\"sector\": \"TD\", \"subSector\": \"any\"}]'),
('CDC', '[{\"sector\": \"CDC\", \"subSector\": \"any\"}]'),
('GRC', '[{\"sector\": \"GRC\", \"subSector\": \"any\"}]'),
('GRC-CDC', '[{\"sector\": \"ADC\", \"subSector\": \"any\"}, {\"sector\": \"GRC\", \"subSector\": \"any\"}, {\"sector\": \"TPC\", \"subSector\": \"any\"}]'),
('GRC-TPC', '[{\"sector\": \"ADC\", \"subSector\": \"any\"}, {\"sector\": \"GRC\", \"subSector\": \"any\"}, {\"sector\": \"CDC\", \"subSector\": \"any\"}]'),
('GRC-TPC-CDC', '[{\"sector\": \"ADC\", \"subSector\": \"any\"}, {\"sector\": \"GRC\", \"subSector\": \"any\"}]'),
('S1', '[{\"sector\": \"SV1\", \"subSector\": \"any\"}]');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sectors`
--

CREATE TABLE `sectors` (
  `id` varchar(6) NOT NULL,
  `minRating` int NOT NULL,
  `childElements` json NOT NULL,
  `priority` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `sectors`
--

INSERT INTO `sectors` (`id`, `minRating`, `childElements`, `priority`) VALUES
('ADC', 3, '[\"ADC\"]', 19),
('CDC', 2, '[\"CDC\"]', 22),
('CTR EC', 5, '[\"EC\"]', 16),
('CTR PC', 5, '[\"PC\"]', 15),
('EH', 5, '[\"EC\", \"PC\"]', 8),
('EL', 5, '[\"EC\", \"PC\"]', 6),
('EU', 5, '[\"EC\", \"PC\"]', 7),
('FMP', 4, '[\"FM\"]', 24),
('GRC', 2, '[\"GRC\"]', 20),
('L EC', 5, '[\"EC\"]', 14),
('SV', 4, '[\"SV\"]', 18),
('SV1', 5, '[\"SV\"]', 1),
('TD', 4, '[\"EC\"]', 11),
('TPC', 2, '[\"TPC\"]', 21),
('TRE/L', 4, '[\"EC\", \"PC\"]', 12),
('TRW/U', 4, '[\"EC\", \"PC\"]', 10),
('WH', 5, '[\"EC\", \"PC\"]', 3),
('WL', 5, '[\"EC\", \"PC\"]', 5),
('WU', 5, '[\"EC\", \"PC\"]', 4);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
