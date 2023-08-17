-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 17, 2023 lúc 01:45 PM
-- Phiên bản máy phục vụ: 10.4.22-MariaDB
-- Phiên bản PHP: 8.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `true_game`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `candidate`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `examiner`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `game`
--

CREATE TABLE `game` (
  `id_game` bigint(20) NOT NULL,
  `name_game` varchar(255) DEFAULT NULL,
  `background` varchar(255) DEFAULT NULL,
  `link_examiner` varchar(255) DEFAULT NULL,
  `link_viewer` varchar(255) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `max_vote` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `game_examiner`
--

CREATE TABLE `game_examiner` (
  `id` bigint(20) NOT NULL,
  `id_examiner` bigint(20) NOT NULL,
  `id_game` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `game_master`
--

CREATE TABLE `game_master` (
  `id_game_master` bigint(20) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `expired` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `game_master`
--

INSERT INTO `game_master` (`id_game_master`, `username`, `password`, `token`, `expired`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2a$10$bOUItZ/Vah.m3NJPZw907.qje.U3DudbEkxZO/PobSjExob9I2dDG', NULL, NULL, '2022-07-06 18:36:41', '2023-07-31 18:36:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `point`
--

CREATE TABLE `point` (
  `id_point` bigint(20) NOT NULL,
  `id_candidate` bigint(20) DEFAULT NULL,
  `id_examiner` bigint(20) DEFAULT NULL,
  `id_game` bigint(20) NOT NULL,
  `point` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `point_ladder`
--

CREATE TABLE `point_ladder` (
  `id_point_ladder` bigint(20) NOT NULL,
  `title` text NOT NULL,
  `max_point` double NOT NULL,
  `id_game` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `candidate`
--
ALTER TABLE `candidate`
  ADD PRIMARY KEY (`id_candidate`),
  ADD KEY `id_game` (`id_game`);

--
-- Chỉ mục cho bảng `examiner`
--
ALTER TABLE `examiner`
  ADD PRIMARY KEY (`id_examiner`);

--
-- Chỉ mục cho bảng `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`id_game`);

--
-- Chỉ mục cho bảng `game_examiner`
--
ALTER TABLE `game_examiner`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `game_master`
--
ALTER TABLE `game_master`
  ADD PRIMARY KEY (`id_game_master`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Chỉ mục cho bảng `point`
--
ALTER TABLE `point`
  ADD PRIMARY KEY (`id_point`);

--
-- Chỉ mục cho bảng `point_ladder`
--
ALTER TABLE `point_ladder`
  ADD PRIMARY KEY (`id_point_ladder`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `candidate`
--
ALTER TABLE `candidate`
  MODIFY `id_candidate` bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `examiner`
--
ALTER TABLE `examiner`
  MODIFY `id_examiner` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `game`
--
ALTER TABLE `game`
  MODIFY `id_game` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `game_examiner`
--
ALTER TABLE `game_examiner`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `game_master`
--
ALTER TABLE `game_master`
  MODIFY `id_game_master` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `point`
--
ALTER TABLE `point`
  MODIFY `id_point` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT cho bảng `point_ladder`
--
ALTER TABLE `point_ladder`
  MODIFY `id_point_ladder` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `candidate`
--
ALTER TABLE `candidate`
  ADD CONSTRAINT `candidate_ibfk_1` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
