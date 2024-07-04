-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: mysql
-- Létrehozás ideje: 2024. Júl 04. 14:59
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
('EH', 5, '[\"EC, PC\"]'),
('EL', 5, '[\"EC, PC\"]'),
('EU', 5, '[\"EC, PC\"]'),
('FMP', 4, '[\"FM\"]'),
('GRC', 2, '[\"GRC\"]'),
('L EC', 5, '[\"EC\"]'),
('SV', 4, '[\"SV\"]'),
('SV1', 5, '[\"SV\"]'),
('TD', 4, '[\"EC\"]'),
('TPC', 2, '[\"TPC\"]'),
('TRE/L', 4, '[\"EC, PC\"]'),
('TRE/U', 4, '[\"EC, PC\"]'),
('WH', 5, '[\"EC, PC\"]'),
('WL', 5, '[\"EC, PC\"]'),
('WU', 5, '[\"EC, PC\"]');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `sectors`
--
ALTER TABLE `sectors`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
