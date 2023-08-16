-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 16, 2023 at 04:57 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `true_game`
--

-- --------------------------------------------------------

--
-- Table structure for table `candidate`
--

CREATE TABLE `candidate` (
  `id_candidate` bigint(11) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `ratting` int(11) DEFAULT NULL,
  `id_game` bigint(20) NOT NULL,
  `active` int(11) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidate`
--

INSERT INTO `candidate` (`id_candidate`, `fullname`, `title`, `avatar`, `ratting`, `id_game`, `active`, `type`, `created_at`, `updated_at`) VALUES
(25, 'Nguyễn Quốc Hưng', 'Until I Found You ♫ A Playlist By Fall In Luv (Fall Cover)', 'd0526d00-aaf4-4ebb-afd9-dd14dc8fdb50.png', 2, 26, 2, 'SINGLE', NULL, NULL),
(26, 'Nguyễn Thị B', 'Until I Found You ♫ A Playlist By Fall In Luv (Fall Cover)', 'e60e54d0-3c82-4ecf-b51b-75924bcb10de.png', 3, 26, 2, 'SINGLE', NULL, NULL),
(27, 'Nguyen Thi Ngan', 'KINH DỊ GIÚP BẠN NGỦ | ZASHIKI ONNA - CHƯA CHẮC CÓ NGƯỜI THEO ĐUỔI ĐÃ LÀ VUI!', 'a07bb801-0663-42b0-be08-ff599c5f9b4c.png', 4, 26, 2, 'SINGLE', NULL, NULL),
(29, 'sadas', 'asdasdasd', 'default-150x150.png', 0, 26, 1, 'LIST', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `examiner`
--

CREATE TABLE `examiner` (
  `id_examiner` bigint(20) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `id_game` bigint(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `examiner`
--

INSERT INTO `examiner` (`id_examiner`, `username`, `password`, `fullname`, `title`, `avatar`, `id_game`, `created_at`, `updated_at`) VALUES
(8, 'nhannv', '$2a$10$cVDdD6mkC3yi9eM1MYLVPeHEc/jTNFY1TOGEokZf2oOWEKWBdmJki', 'Nguyễn Văn Nhân', 'Giám Đốc Chi Nhánh', '7fa9b215-25e8-4548-8661-4ba2501393b0.png', 26, NULL, NULL),
(9, 'abc', '$2a$10$uZSXFhYlykM0M9ovyG55pOfB2a.Cano.6ZVqBaSgzjld7Afu88kIi', 'aksjhdkjashd', 'asjdhaksjhasdjk', 'dc9a1342-50ae-4791-b300-3f4f4bd0477b.png', 26, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE `game` (
  `id_game` bigint(20) NOT NULL,
  `name_game` varchar(255) DEFAULT NULL,
  `background` varchar(255) DEFAULT NULL,
  `link_examiner` varchar(255) DEFAULT NULL,
  `link_viewer` varchar(255) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game`
--

INSERT INTO `game` (`id_game`, `name_game`, `background`, `link_examiner`, `link_viewer`, `active`, `created_at`, `updated_at`) VALUES
(26, 'Cuộc Thi Âm Nhạc Liên Chi Nhánh Năm 2023 2', '/template/image/background.png', '/vote-game/view/examiner', '/vote-game/view/viewer', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `game_examiner`
--

CREATE TABLE `game_examiner` (
  `id` bigint(20) NOT NULL,
  `id_examiner` bigint(20) NOT NULL,
  `id_game` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_master`
--

CREATE TABLE `game_master` (
  `id_game_master` bigint(20) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `expired` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game_master`
--

INSERT INTO `game_master` (`id_game_master`, `username`, `password`, `token`, `expired`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2a$10$bOUItZ/Vah.m3NJPZw907.qje.U3DudbEkxZO/PobSjExob9I2dDG', NULL, NULL, '2022-07-06 18:36:41', '2023-07-31 18:36:41');

-- --------------------------------------------------------

--
-- Table structure for table `point`
--

CREATE TABLE `point` (
  `id_point` bigint(20) NOT NULL,
  `id_candidate` bigint(20) DEFAULT NULL,
  `id_examiner` bigint(20) DEFAULT NULL,
  `id_game` bigint(20) NOT NULL,
  `point` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `point`
--

INSERT INTO `point` (`id_point`, `id_candidate`, `id_examiner`, `id_game`, `point`, `created_at`, `updated_at`) VALUES
(41, 26, 8, 26, 8, NULL, NULL),
(51, 27, 8, 26, 10, NULL, NULL),
(52, 25, 8, 26, 10, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidate`
--
ALTER TABLE `candidate`
  ADD PRIMARY KEY (`id_candidate`),
  ADD KEY `id_game` (`id_game`);

--
-- Indexes for table `examiner`
--
ALTER TABLE `examiner`
  ADD PRIMARY KEY (`id_examiner`);

--
-- Indexes for table `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`id_game`);

--
-- Indexes for table `game_examiner`
--
ALTER TABLE `game_examiner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_master`
--
ALTER TABLE `game_master`
  ADD PRIMARY KEY (`id_game_master`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `point`
--
ALTER TABLE `point`
  ADD PRIMARY KEY (`id_point`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidate`
--
ALTER TABLE `candidate`
  MODIFY `id_candidate` bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `examiner`
--
ALTER TABLE `examiner`
  MODIFY `id_examiner` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `id_game` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `game_examiner`
--
ALTER TABLE `game_examiner`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_master`
--
ALTER TABLE `game_master`
  MODIFY `id_game_master` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `point`
--
ALTER TABLE `point`
  MODIFY `id_point` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidate`
--
ALTER TABLE `candidate`
  ADD CONSTRAINT `candidate_ibfk_1` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
