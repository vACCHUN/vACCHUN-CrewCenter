-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Nov 18, 2025 at 12:50 PM
-- Server version: 9.0.0
-- PHP Version: 8.2.29

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
  `initial` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CID` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `trainee` tinyint(1) DEFAULT NULL,
  `isInstructor` tinyint(1) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `access_token` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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
('LHBP_D_APP', 'TD', 'EC'),
('LHBP_DEL', 'CDC', 'CDC'),
('LHBP_GND', 'GRC', 'GRC'),
('LHBP_TWR', 'ADC', 'ADC'),
('LHBP_U_APP', 'TRW/U', 'EC'),
('LHBP_W_DEP', 'TRW/L', 'EC'),
('LHCC_CTR', 'EL', 'EC'),
('LHCC_I_CTR', 'CTR EC', 'EC'),
('LHDC_I_TWR', 'LHDC', 'LHDC'),
('LHPP_I_TWR', 'LHPP', 'LHPP'),
('LHPR_I_TWR', 'LHPR', 'LHPR'),
('LHSM_I_TWR', 'LHSM', 'LHSM');

-- --------------------------------------------------------

--
-- Table structure for table `controllerBookings`
--

CREATE TABLE `controllerBookings` (
  `id` int NOT NULL,
  `bookingapi_id` int DEFAULT NULL,
  `initial` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cid` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `startTime` datetime(6) NOT NULL,
  `endTime` datetime(6) NOT NULL,
  `sector` varchar(15) NOT NULL,
  `subSector` varchar(15) NOT NULL,
  `training` tinyint(1) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `private_booking` tinyint(1) NOT NULL DEFAULT '0',
  `is_exam` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `synced_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectorisationCodes`
--

CREATE TABLE `sectorisationCodes` (
  `id` int NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sectorType` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `requiredSectors` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sectorisationCodes`
--

INSERT INTO `sectorisationCodes` (`id`, `name`, `sectorType`, `requiredSectors`) VALUES
(1, '1', 'BFMP', '[{\"sector\": \"FMP\", \"subSector\": \"FM\"}]'),
(2, 'ADC', 'BTWR', '[{\"sector\": \"ADC\", \"subSector\": \"ADC\"}]'),
(3, 'APP1', 'BAPP', '[{\"sector\": \"TRE/L\", \"subSector\": \"EC\"}]'),
(4, 'APP2', 'BAPP', '[{\"sector\": \"TRE/L\", \"subSector\": \"EC\"}, {\"sector\": \"TRE/L \", \"subSector\": \"PC\"}]'),
(5, 'APP3', 'BAPP', '[{\"sector\": \"TRE/L\", \"subSector\": \"EC\"}, {\"sector\": \"TD\", \"subSector\": \"EC\"}]'),
(6, 'APP4', 'BAPP', '[{\"sector\": \"TRE/L\", \"subSector\": \"EC\"}, {\"sector\": \"TRW/U\", \"subSector\": \"EC\"}]'),
(7, 'APP5', 'BAPP', '[{\"sector\": \"TRE/L\", \"subSector\": \"EC\"}, {\"sector\": \"TRW/U\", \"subSector\": \"EC\"}, {\"sector\": \"TD\", \"subSector\": \"EC\"}]'),
(8, 'CDC', 'BTWR', '[{\"sector\": \"CDC\", \"subSector\": \"CDC\"}]'),
(9, 'GRC', 'BTWR', '[{\"sector\": \"GRC\", \"subSector\": \"GRC\"}]'),
(10, 'GRC-CDC', 'BTWR', '[{\"sector\": \"ADC\", \"subSector\": \"ADC\"}, {\"sector\": \"GRC\", \"subSector\": \"GRC\"}, {\"sector\": \"TPC\", \"subSector\": \"TPC\"}]'),
(11, 'GRC-TPC', 'BTWR', '[{\"sector\": \"ADC\", \"subSector\": \"ADC\"}, {\"sector\": \"GRC\", \"subSector\": \"GRC\"}, {\"sector\": \"CDC\", \"subSector\": \"CDC\"}]'),
(12, 'GRC-TPC-CDC', 'BTWR', '[{\"sector\": \"ADC\", \"subSector\": \"ADC\"}, {\"sector\": \"GRC\", \"subSector\": \"GRC\"}]'),
(13, 'S1', 'ATS SV', '[{\"sector\": \"SV1\", \"subSector\": \"SV\"}]'),
(14, 'APP2', 'BAPP', '[{\"sector\": \"TRE/L\", \"subSector\": \"EC\"}, {\"sector\": \"TD\", \"subSector\": \"EC\"}]'),
(15, 'APP3', 'BAPP', '[{\"sector\": \"TRE/L\", \"subSector\": \"EC\"}, {\"sector\": \"TRW/U\", \"subSector\": \"EC\"}, {\"sector\": \"TD\", \"subSector\": \"EC\"}]'),
(16, '1/1', 'BACC', '[{\"sector\": \"EL\", \"subSector\": \"EC\"}]'),
(17, '2A', 'BACC', '[{\"sector\": \"EL\", \"subSector\": \"EC\"}, {\"sector\": \"WL\", \"subSector\": \"EC\"}]'),
(18, '2C', 'BACC', '[{\"sector\": \"EL\", \"subSector\": \"EC\"}, {\"sector\": \"WT\", \"subSector\": \"EC\"}]'),
(19, '2B', 'BACC', '[{\"sector\": \"EL\", \"subSector\": \"EC\"}, {\"sector\": \"WU\", \"subSector\": \"EC\"}]'),
(20, '3F2', 'BACC', '[{\"sector\": \"EL\", \"subSector\": \"EC\"}, {\"sector\": \"WL\", \"subSector\": \"EC\"}, {\"sector\": \"WT\", \"subSector\": \"EC\"}]'),
(21, '3B', 'BACC', '[{\"sector\": \"EL\", \"subSector\": \"EC\"}, {\"sector\": \"WL\", \"subSector\": \"EC\"}, {\"sector\": \"WU\", \"subSector\": \"EC\"}]'),
(22, '4J2', 'BACC', '[{\"sector\": \"EL\", \"subSector\": \"EC\"}, {\"sector\": \"WL\", \"subSector\": \"EC\"}, {\"sector\": \"WU\", \"subSector\": \"EC\"}, {\"sector\": \"EU\", \"subSector\": \"EC\"}]'),
(23, '4K3', 'BACC', '[{\"sector\": \"EL\", \"subSector\": \"EC\"}, {\"sector\": \"WL\", \"subSector\": \"EC\"}, {\"sector\": \"ET\", \"subSector\": \"EC\"}, {\"sector\": \"WT\", \"subSector\": \"EC\"}]'),
(24, '4K2', 'BACC', '[{\"sector\": \"EL\", \"subSector\": \"EC\"}, {\"sector\": \"WL\", \"subSector\": \"EC\"}, {\"sector\": \"EU\", \"subSector\": \"EC\"}]'),
(25, '4J3', 'BACC', '[{\"sector\": \"EL\", \"subSector\": \"EC\"}, {\"sector\": \"WL\", \"subSector\": \"EC\"}, {\"sector\": \"ET\", \"subSector\": \"EC\"}, {\"sector\": \"WU\", \"subSector\": \"EC\"}]'),
(26, '10', 'BFIC', '[{\"sector\": \"CTR EC\", \"subSector\": \"EC\"}]'),
(27, '20', 'BFIC', '[{\"sector\": \"CTR EC\", \"subSector\": \"EC\"}, {\"sector\": \"CTR PC\", \"subSector\": \"PC\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `sectors`
--

CREATE TABLE `sectors` (
  `id` varchar(6) NOT NULL,
  `minRating` int NOT NULL,
  `childElements` json NOT NULL,
  `priority` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sectors`
--

INSERT INTO `sectors` (`id`, `minRating`, `childElements`, `priority`) VALUES
('ADC', 3, '[\"ADC\"]', 19),
('ATS SV', 999, '[\"ATS SV\"]', 0),
('BACC', 999, '[\"BACC\"]', 2),
('BAPP', 999, '[\"BAPP\"]', 8.5),
('BFIC', 999, '[\"BFIC\"]', 13.5),
('BTWR', 999, '[\"BTWR\"]', 17),
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
('NU', 5, '[\"EC\", \"PC\"]', 2),
('RES1', 2, '[\"RES1\"]', -3),
('RES2', 2, '[\"RES2\"]', -2),
('RES3', 2, '[\"RES3\"]', -1),
('SV', 4, '[\"SV\"]', 18),
('SV1', 5, '[\"SV\"]', 1),
('TD', 4, '[\"EC\"]', 11),
('TPC', 2, '[\"TPC\"]', 21),
('TRE/L', 4, '[\"EC\"]', 12),
('TRE/L ', 4, '[\"PC\"]', 13),
('TRW/L', 4, '[\"EC\", \"PC\"]', 10),
('TRW/U', 4, '[\"EC\", \"PC\"]', 9),
('WH', 5, '[\"EC\", \"PC\"]', 3),
('WL', 5, '[\"EC\", \"PC\"]', 5),
('WU', 5, '[\"EC\", \"PC\"]', 4);

-- --------------------------------------------------------

--
-- Table structure for table `visitors`
--

CREATE TABLE `visitors` (
  `cid` int NOT NULL,
  `initial` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `visitors`
--


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
-- Indexes for table `events`
--
ALTER TABLE `events`
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

ALTER TABLE `visitors`
  ADD PRIMARY KEY (`cid`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2743;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;