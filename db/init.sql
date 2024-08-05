-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: mysql
-- Létrehozás ideje: 2024. Aug 05. 20:24
-- Kiszolgáló verziója: 9.0.0
-- PHP verzió: 8.2.21

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
('BA', 1434652, 'Gergely Balint', 0, 0, 0),
('BB', 1300686, 'Bence Bozi', 0, 0, 1),
('BO', 1242351, 'Tamas Bohus', 0, 0, 0),
('CG', 904331, 'Gergely Csernak', 0, 0, 0),
('CS', 1582533, 'Csörgő Csaba', 0, 0, 1),
('FL', 1034649, 'Tamas Flasko', 0, 0, 0),
('GP', 1516597, 'Peter Grob', 0, 0, 1),
('GT', 912350, 'Tamas Galyassy', 0, 0, 0),
('HU', 1750887, 'Bendeguz Bota-Huszagh', 0, 0, 0),
('JN', 1582352, 'Jenei Ákos', 1, 0, 0),
('KL', 1757708, 'Laszlo Matyas Keresztesi', 0, 0, 0),
('MR', 1412730, 'Richard Moravcsik', 0, 0, 0),
('NY', 1737747, 'Nyiri Benjamin', 0, 0, 0),
('OC', 1433686, 'Oliver Cesarczyk', 0, 0, 0),
('RD', 1168623, 'David Rozsenberszki', 0, 0, 0),
('RT', 1674145, 'Tamas Radnai', 0, 0, 0),
('SA', 1314609, 'Zoltan Sarkozi', 0, 0, 0),
('SB', 1006444, 'Balazs Sule', 0, 1, 1),
('SJ', 972369, 'Bálint Szíj', 0, 0, 0),
('SL', 1493904, 'Szalko Balint', 0, 0, 0),
('SZ', 1337518, 'Barna Sztojan', 0, 0, 0),
('UJ', 1623074, 'Domonkos Ujhelyi', 0, 0, 1),
('VA', 1742974, 'Balint Varga', 0, 0, 0),
('VG', 853189, 'Gábor Varga', 0, 0, 0),
('ZE', 1754374, 'Zeteny Zeley', 0, 0, 0);

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

--
-- A tábla adatainak kiíratása `controllerBookings`
--

INSERT INTO `controllerBookings` (`id`, `initial`, `cid`, `name`, `startTime`, `endTime`, `sector`, `subSector`, `training`) VALUES
(20, 'JN', 1582352, 'Jenei Ákos', '2024-08-05 18:00:00.000000', '2024-08-05 20:00:00.000000', 'TRE/L', 'EC', 1),
(21, 'BO', 1242351, 'Tamas Bohus', '2024-08-05 16:30:00.000000', '2024-08-05 18:00:00.000000', 'TRE/L', 'EC', 0),
(22, 'HU', 1750887, 'Bendeguz Bota-Huszagh', '2024-08-05 18:00:00.000000', '2024-08-05 20:00:00.000000', 'ADC', 'ADC', 0),
(25, 'SB', 1006444, 'Balazs Sule', '2024-08-05 16:30:00.000000', '2024-08-05 18:00:00.000000', 'EL', 'EC', 0),
(26, 'CG', 904331, 'Gergely Csernak', '2024-08-05 18:00:00.000000', '2024-08-05 20:00:00.000000', 'EL', 'EC', 0),
(27, 'FL', 1034649, 'Tamas Flasko', '2024-08-05 16:30:00.000000', '2024-08-05 18:00:00.000000', 'ADC', 'ADC', 1),
(28, 'RT', 1674145, 'Tamas Radnai', '2024-08-05 18:00:00.000000', '2024-08-05 20:00:00.000000', 'GRC', 'GRC', 0),
(29, 'BO', 1242351, 'Tamas Bohus', '2024-08-05 18:00:00.000000', '2024-08-05 20:00:00.000000', 'TRE/L', 'PC', 0),
(30, 'BB', 1300686, 'Bence Bozi', '2024-08-05 19:00:00.000000', '2024-08-05 20:00:00.000000', 'WL', 'EC', 0),
(31, 'BB', 1300686, 'Bence Bozi', '2024-08-05 16:30:00.000000', '2024-08-05 19:00:00.000000', 'SV1', 'SV', 0),
(32, 'CG', 904331, 'Gergely Csernak', '2024-08-10 08:00:00.000000', '2024-08-10 09:30:00.000000', 'EL', 'EC', 0),
(33, 'UJ', 1623074, 'Domonkos Ujhelyi', '2024-08-10 08:00:00.000000', '2024-08-10 09:30:00.000000', 'ADC', 'ADC', 0),
(34, 'GT', 912350, 'Tamas Galyassy', '2024-08-10 08:00:00.000000', '2024-08-10 09:30:00.000000', 'TRE/L', 'EC', 0),
(35, 'KL', 1757708, 'Laszlo Matyas Keresztesi', '2024-08-10 08:00:00.000000', '2024-08-10 09:30:00.000000', 'CDC', 'CDC', 0),
(36, 'BB', 1300686, 'Bence Bozi', '2024-08-10 08:00:00.000000', '2024-08-10 09:30:00.000000', 'SV1', 'SV', 0),
(37, 'BB', 1300686, 'Bence Bozi', '2024-08-10 09:30:00.000000', '2024-08-10 11:00:00.000000', 'EL', 'EC', 0),
(38, 'BB', 1300686, 'Bence Bozi', '2024-08-10 11:00:00.000000', '2024-08-10 12:00:00.000000', 'SV1', 'SV', 0),
(39, 'SB', 1006444, 'Balazs Sule', '2024-08-10 09:30:00.000000', '2024-08-10 11:00:00.000000', 'SV1', 'SV', 0),
(40, 'BB', 1300686, 'Bence Bozi', '2024-08-10 13:30:00.000000', '2024-08-10 15:00:00.000000', 'CDC', 'CDC', 0);

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
('LHDC', 3, '[\"LHDC\"]', 26),
('LHPP', 3, '[\"LHPP\"]', 30),
('LHPR', 3, '[\"LHPR\"]', 32),
('LHSM', 3, '[\"LHSM\"]', 28),
('SV', 4, '[\"SV\"]', 18),
('SV1', 5, '[\"SV\"]', 1),
('TD', 4, '[\"EC\"]', 11),
('TPC', 2, '[\"TPC\"]', 21),
('TRE/L', 4, '[\"EC\"]', 12),
('TRE/L ', 4, '[\"PC\"]', 13),
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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
