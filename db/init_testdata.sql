-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: May 12, 2025 at 05:45 PM
-- Server version: 9.0.0
-- PHP Version: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacchuncc`
--
CREATE DATABASE IF NOT EXISTS `vacchuncc` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `vacchuncc`;

-- --------------------------------------------------------

--
-- Table structure for table `ATCOs`
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
-- Dumping data for table `ATCOs`
--

INSERT INTO `ATCOs` (`initial`, `CID`, `name`, `trainee`, `isInstructor`, `isAdmin`) VALUES
('BB', 123456, 'Bozi Bence', 0, 0, 1),
('CS', 1582533, 'Csörgő Csaba', 0, 0, 0),
('JN', 1582534, 'Jenei Ákos', 0, 0, 1),
('TE', 10000010, 'Web Ten', 0, 0, 1),
('UJ', 156874, 'Ujhelyi Domonkos', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `atcTrainingBookings`
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
-- Table structure for table `callsigns`
--

CREATE TABLE `callsigns` (
  `callsign` varchar(50) NOT NULL,
  `sector` varchar(10) NOT NULL,
  `subSector` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `callsigns`
--

INSERT INTO `callsigns` (`callsign`, `sector`, `subSector`) VALUES
('LHBP_APP', 'TRE/L', 'EC'),
('LHBP_DEL', 'CDC', 'CDC'),
('LHBP_GND', 'GRC', 'GRC'),
('LHBP_TWR', 'ADC', 'ADC'),
('LHCC_CTR', 'EL', 'EC'),
('LHDC_I_TWR', 'LHDC', 'LHDC'),
('LHSM_I_TWR', 'LHSM', 'LHSM');

-- --------------------------------------------------------

--
-- Table structure for table `controllerBookings`
--

CREATE TABLE `controllerBookings` (
  `id` int NOT NULL,
  `bookingapi_id` int DEFAULT NULL,
  `initial` varchar(2) NOT NULL,
  `cid` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `startTime` datetime(6) NOT NULL,
  `endTime` datetime(6) NOT NULL,
  `sector` varchar(15) NOT NULL,
  `subSector` varchar(15) NOT NULL,
  `training` tinyint(1) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `private_booking` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectorisationCodes`
--

CREATE TABLE `sectorisationCodes` (
  `id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `requiredSectors` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sectorisationCodes`
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
-- Table structure for table `sectors`
--

CREATE TABLE `sectors` (
  `id` varchar(6) NOT NULL,
  `minRating` int NOT NULL,
  `childElements` json NOT NULL,
  `priority` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sectors`
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
('RES1', 2, '[\"RES1\"]', -3),
('RES2', 2, '[\"RES2\"]', -2),
('RES3', 2, '[\"RES3\"]', -1),
('SV', 4, '[\"SV\"]', 18),
('SV1', 5, '[\"SV\"]', 1),
('TD', 4, '[\"EC\"]', 11),
('TPC', 2, '[\"TPC\"]', 21),
('TRE/L', 4, '[\"EC\"]', 12),
('TRE/L ', 4, '[\"PC\"]', 13),
('TRW/U', 4, '[\"EC\", \"PC\"]', 10),
('WH', 5, '[\"EC\", \"PC\"]', 3),
('WL', 5, '[\"EC\", \"PC\"]', 5),
('WU', 5, '[\"EC\", \"PC\"]', 4);

-- --------------------------------------------------------

--
-- Table structure for table `visitors`
--

CREATE TABLE `visitors` (
  `cid` int NOT NULL,
  `initial` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ATCOs`
--
ALTER TABLE `ATCOs`
  ADD PRIMARY KEY (`initial`);

--
-- Indexes for table `atcTrainingBookings`
--
ALTER TABLE `atcTrainingBookings`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `callsigns`
--
ALTER TABLE `callsigns`
  ADD PRIMARY KEY (`callsign`);

--
-- Indexes for table `controllerBookings`
--
ALTER TABLE `controllerBookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sectorisationCodes`
--
ALTER TABLE `sectorisationCodes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sectors`
--
ALTER TABLE `sectors`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `atcTrainingBookings`
--
ALTER TABLE `atcTrainingBookings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `controllerBookings`
--
ALTER TABLE `controllerBookings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;