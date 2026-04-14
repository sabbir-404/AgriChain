-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 13, 2026 at 06:19 PM
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
-- Database: `agrichain`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`user_id`) VALUES
(1),
(13),
(14);

-- --------------------------------------------------------

--
-- Table structure for table `delivery`
--

CREATE TABLE `delivery` (
  `delivery_id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `market_id` int(11) NOT NULL,
  `logistics_manager_id` int(11) NOT NULL,
  `source_area` varchar(100) DEFAULT NULL,
  `source_district` varchar(100) DEFAULT NULL,
  `destination_area` varchar(100) DEFAULT NULL,
  `destination_district` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `transport_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `delivery`
--

INSERT INTO `delivery` (`delivery_id`, `batch_id`, `market_id`, `logistics_manager_id`, `source_area`, `source_district`, `destination_area`, `destination_district`, `status`, `transport_date`) VALUES
(2, 3, 2, 11, 'Agrabad', 'Chittagong', 'Khatunganj', 'Chittagong', 'Delivered', '2025-05-24'),
(3, 6, 1, 11, 'Agrabad', 'Chittagong', 'Karwan Bazar', 'Dhaka', 'In Transit', '2025-04-26'),
(4, 2, 2, 11, 'Tongi', 'Dhaka', 'Khatunganj', 'Chittagong', 'Delivered', '2025-03-12'),
(5, 4, 3, 11, 'Sunamganj', 'Sylhet', 'Bandarbazar', 'Sylhet', 'Pending', '2025-05-01'),
(6, 8, 2, 11, 'Sunamganj', 'Sylhet', 'Khatunganj', 'Chittagong', 'Delivered', '2025-03-16');

-- --------------------------------------------------------

--
-- Table structure for table `farmers`
--

CREATE TABLE `farmers` (
  `user_id` int(11) NOT NULL,
  `farm_village` varchar(100) DEFAULT NULL,
  `farm_district` varchar(100) DEFAULT NULL,
  `farm_size` decimal(10,2) DEFAULT NULL,
  `crop_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farmers`
--

INSERT INTO `farmers` (`user_id`, `farm_village`, `farm_district`, `farm_size`, `crop_type`) VALUES
(4, 'Tangail Sadar', 'Tangail', 10.50, 'Rice'),
(5, 'Bogura Sadar', 'Bogura', 8.00, 'Wheat'),
(12, 'test', 'test', 12.00, 'test'),
(15, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `harvest_batch`
--

CREATE TABLE `harvest_batch` (
  `batch_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `harvest_date` date NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `quality_grade` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `harvest_batch`
--

INSERT INTO `harvest_batch` (`batch_id`, `farmer_id`, `product_id`, `harvest_date`, `quantity`, `quality_grade`) VALUES
(2, 4, 2, '2025-03-08', 31.00, 'Grade B'),
(3, 5, 3, '2025-05-20', 42.00, 'Grade A'),
(4, 5, 4, '2025-01-18', 26.50, 'Grade B'),
(5, 4, 5, '2025-03-22', 16.00, 'Grade C'),
(6, 5, 1, '2025-04-22', 47.00, 'Grade A'),
(7, 4, 4, '2025-05-24', 33.00, 'Grade A'),
(8, 5, 2, '2025-03-12', 28.00, 'Grade A');

-- --------------------------------------------------------

--
-- Table structure for table `input_supply`
--

CREATE TABLE `input_supply` (
  `supply_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `input_type` varchar(100) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `supply_date` date NOT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  `procurement_schedule` date DEFAULT NULL,
  `current_stock_level` decimal(10,2) DEFAULT NULL,
  `usage_rate` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `input_supply`
--

INSERT INTO `input_supply` (`supply_id`, `farmer_id`, `supplier_id`, `input_type`, `quantity`, `supply_date`, `cost`, `procurement_schedule`, `current_stock_level`, `usage_rate`) VALUES
(1, 4, 6, 'Urea Fertilizer', 500.00, '2025-03-05', 25000.00, '2025-03-01', 180.00, 2.50),
(2, 5, 6, 'DAP Fertilizer', 300.00, '2025-02-15', 18000.00, '2025-02-10', 120.00, 1.80),
(3, 4, 6, 'Pesticide (Cypro)', 50.00, '2025-04-02', 12000.00, '2025-04-01', 20.00, 0.30),
(4, 5, 6, 'BARI Wheat Seeds', 200.00, '2024-10-20', 15000.00, '2024-10-15', 150.00, 1.00),
(5, 4, 6, 'Potash Fertilizer', 250.00, '2025-01-10', 14000.00, '2025-01-05', 200.00, 1.50);

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `inventory_id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `shelf_life` int(11) DEFAULT NULL,
  `remaining_shelf_life` int(11) DEFAULT NULL,
  `packaging_details` varchar(150) DEFAULT NULL,
  `reorder_level` decimal(10,2) DEFAULT NULL,
  `max_stock_level` decimal(10,2) DEFAULT NULL,
  `stock_status` varchar(50) DEFAULT 'In Stock'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventory_id`, `batch_id`, `warehouse_id`, `quantity`, `shelf_life`, `remaining_shelf_life`, `packaging_details`, `reorder_level`, `max_stock_level`, `stock_status`) VALUES
(2, 2, 1, 28.00, 150, 140, 'PP bags', 4.00, 3000.00, 'Out of Stock'),
(3, 3, 2, 38.00, 120, 115, 'Bulk bin', 3.00, 3000.00, 'In Stock'),
(4, 4, 3, 22.00, 60, 55, 'Mesh bags 25kg', 2.00, 2000.00, 'Low Stock'),
(5, 6, 2, 43.00, 180, 172, 'Jute bags 50kg', 5.00, 3000.00, 'In Stock'),
(6, 7, 1, 29.00, 120, 118, 'Bulk bin', 3.00, 5000.00, 'In Stock'),
(7, 8, 3, 24.00, 150, 145, 'PP bags', 4.00, 2000.00, 'In Stock'),
(8, 7, 2, 12.00, 10, 20, NULL, 10.00, 10.00, 'Low Stock');

-- --------------------------------------------------------

--
-- Table structure for table `logistics_managers`
--

CREATE TABLE `logistics_managers` (
  `user_id` int(11) NOT NULL,
  `transport_unit` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logistics_managers`
--

INSERT INTO `logistics_managers` (`user_id`, `transport_unit`) VALUES
(11, 'Fleet A — 6 Trucks'),
(20, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `market`
--

CREATE TABLE `market` (
  `market_id` int(11) NOT NULL,
  `operator_id` int(11) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zone` varchar(100) DEFAULT NULL,
  `market_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `market`
--

INSERT INTO `market` (`market_id`, `operator_id`, `city`, `zone`, `market_type`) VALUES
(1, 10, 'Dhaka', 'Karwan Bazar', 'Wholesale'),
(2, 10, 'Chittagong', 'Khatunganj', 'Wholesale'),
(3, 10, 'Sylhet', 'Bandarbazar', 'Retail');

-- --------------------------------------------------------

--
-- Table structure for table `market_operators`
--

CREATE TABLE `market_operators` (
  `user_id` int(11) NOT NULL,
  `market_city` varchar(100) DEFAULT NULL,
  `market_zone` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `market_operators`
--

INSERT INTO `market_operators` (`user_id`, `market_city`, `market_zone`) VALUES
(10, 'Dhaka', 'Karwan Bazar'),
(19, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `processing_batch`
--

CREATE TABLE `processing_batch` (
  `processing_id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `plant_id` int(11) NOT NULL,
  `processing_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `processing_batch`
--

INSERT INTO `processing_batch` (`processing_id`, `batch_id`, `plant_id`, `processing_date`) VALUES
(2, 3, 2, '2025-05-23'),
(3, 6, 1, '2025-04-25'),
(4, 2, 2, '2025-03-12'),
(5, 7, 1, '2025-05-28'),
(6, 8, 2, '2025-03-15'),
(7, 7, 2, '2026-04-10');

-- --------------------------------------------------------

--
-- Table structure for table `processing_managers`
--

CREATE TABLE `processing_managers` (
  `user_id` int(11) NOT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `specialization` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `processing_managers`
--

INSERT INTO `processing_managers` (`user_id`, `experience_years`, `specialization`) VALUES
(8, 5, 'Rice Milling'),
(17, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `processing_plant`
--

CREATE TABLE `processing_plant` (
  `plant_id` int(11) NOT NULL,
  `manager_id` int(11) NOT NULL,
  `area` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `process_plants_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `processing_plant`
--

INSERT INTO `processing_plant` (`plant_id`, `manager_id`, `area`, `district`, `process_plants_type`) VALUES
(1, 8, 'Tongi Industrial Area', 'Dhaka', 'Milling'),
(2, 8, 'Agrabad Commercial Area', 'Chittagong', 'Sorting');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `storage_requirement` varchar(150) DEFAULT NULL,
  `shelf_life` int(11) DEFAULT NULL,
  `packaging_details` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `product_name`, `category`, `storage_requirement`, `shelf_life`, `packaging_details`) VALUES
(1, 'Aman Rice', 'Grain', 'Cool & dry, <15% moisture', 180, 'Jute bags 50kg'),
(2, 'Wheat', 'Grain', 'Dry, <13% moisture', 150, 'Polypropylene bags'),
(3, 'Maize', 'Grain', 'Ventilated, <14% moisture', 120, 'Bulk bin'),
(4, 'Potato', 'Vegetable', 'Cold storage 4–10°C', 60, 'Mesh bags 25kg'),
(5, 'Onion', 'Vegetable', 'Dry & ventilated', 90, 'Net bags 20kg');

-- --------------------------------------------------------

--
-- Table structure for table `quality_inspectors`
--

CREATE TABLE `quality_inspectors` (
  `user_id` int(11) NOT NULL,
  `lab_id` varchar(100) DEFAULT NULL,
  `specialty_research_field` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quality_inspectors`
--

INSERT INTO `quality_inspectors` (`user_id`, `lab_id`, `specialty_research_field`) VALUES
(9, 'QC-BD-001', 'Grain Quality & Safety'),
(18, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quality_report`
--

CREATE TABLE `quality_report` (
  `report_id` int(11) NOT NULL,
  `processing_id` int(11) NOT NULL,
  `inspector_id` int(11) NOT NULL,
  `moisture_content` decimal(5,2) DEFAULT NULL,
  `purity` decimal(5,2) DEFAULT NULL,
  `defect_level` varchar(100) DEFAULT NULL,
  `grading_status` varchar(100) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quality_report`
--

INSERT INTO `quality_report` (`report_id`, `processing_id`, `inspector_id`, `moisture_content`, `purity`, `defect_level`, `grading_status`, `remarks`, `created_at`) VALUES
(2, 2, 9, 14.20, 94.80, 'Moderate', 'Fail', 'High moisture content, requires re-drying', '2026-04-11 12:02:28'),
(3, 3, 9, 13.00, 97.20, 'Minor', 'Pass', 'Minor surface impurities, acceptable', '2026-04-11 12:02:28'),
(4, 4, 9, 11.80, 99.00, 'None', 'Pass', 'Premium wheat batch, export quality', '2026-04-11 12:02:28'),
(5, 5, 9, 13.50, 96.50, 'Minor', 'Pass with Conditions', 'Slight discolouration, approve for local market', '2026-04-11 12:02:28'),
(6, 6, 9, 12.10, 98.80, 'None', 'Pass', 'Good quality batch', '2026-04-11 12:02:28');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `sale_id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `market_id` int(11) NOT NULL,
  `sale_date` date NOT NULL,
  `sale_price` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`sale_id`, `batch_id`, `product_id`, `market_id`, `sale_date`, `sale_price`) VALUES
(2, 3, 3, 2, '2025-05-25', 63000.00),
(3, 2, 2, 2, '2025-03-14', 51000.00),
(4, 6, 1, 1, '2025-04-28', 87500.00),
(5, 4, 4, 3, '2025-01-25', 38500.00),
(6, 8, 2, 2, '2025-03-18', 43000.00),
(7, 7, 3, 1, '2025-05-30', 49500.00);

-- --------------------------------------------------------

--
-- Table structure for table `sensor`
--

CREATE TABLE `sensor` (
  `sensor_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `sensor_type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sensor`
--

INSERT INTO `sensor` (`sensor_id`, `warehouse_id`, `sensor_type`) VALUES
(1, 1, 'Temperature & Humidity'),
(2, 2, 'Temperature & Humidity');

-- --------------------------------------------------------

--
-- Table structure for table `sensor_data`
--

CREATE TABLE `sensor_data` (
  `data_id` int(11) NOT NULL,
  `sensor_id` int(11) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp(),
  `temperature` decimal(5,2) DEFAULT NULL,
  `humidity` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sensor_data`
--

INSERT INTO `sensor_data` (`data_id`, `sensor_id`, `timestamp`, `temperature`, `humidity`) VALUES
(1, 1, '2025-04-10 08:00:00', 22.50, 65.00),
(2, 1, '2025-04-10 14:00:00', 26.10, 68.20),
(3, 1, '2025-04-10 20:00:00', 23.80, 64.50),
(4, 2, '2025-04-10 08:00:00', 28.30, 72.00),
(5, 2, '2025-04-10 14:00:00', 31.20, 75.50),
(6, 2, '2025-04-10 20:00:00', 29.00, 71.00);

-- --------------------------------------------------------

--
-- Table structure for table `sowing_logs`
--

CREATE TABLE `sowing_logs` (
  `sowing_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `sowing_date` date NOT NULL,
  `expected_harvest_date` date NOT NULL,
  `seed_type` varchar(100) NOT NULL,
  `used_quantity` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sowing_logs`
--

INSERT INTO `sowing_logs` (`sowing_id`, `farmer_id`, `sowing_date`, `expected_harvest_date`, `seed_type`, `used_quantity`) VALUES
(2, 4, '2025-01-10', '2025-04-20', 'BR-29 Aman Paddy', 120.00),
(3, 4, '2024-11-05', '2025-03-10', 'BARI Wheat-30', 80.00),
(4, 5, '2025-02-01', '2025-05-15', 'BARI Maize-9', 90.00),
(6, 4, '2024-12-01', '2025-03-25', 'Taherpuri Onion', 40.00),
(7, 4, '2026-04-01', '2026-04-23', 'patty', 12.00);

-- --------------------------------------------------------

--
-- Table structure for table `stock_movement`
--

CREATE TABLE `stock_movement` (
  `movement_id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `warehouse_id` int(11) NOT NULL,
  `movement_date` date NOT NULL,
  `quantity_removed` decimal(10,2) NOT NULL,
  `from_location` varchar(150) DEFAULT NULL,
  `to_location` varchar(150) DEFAULT NULL,
  `movement_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_movement`
--

INSERT INTO `stock_movement` (`movement_id`, `batch_id`, `warehouse_id`, `movement_date`, `quantity_removed`, `from_location`, `to_location`, `movement_type`) VALUES
(2, 3, 2, '2025-05-24', 4.00, 'Bay B', 'Gate 2', 'Dispatch'),
(3, 6, 2, '2025-04-26', 3.00, 'Bay A', 'Loading Dock 2', 'Transfer'),
(4, 8, 3, '2025-03-16', 2.50, 'Section C', 'Gate 1', 'Dispatch');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `user_id` int(11) NOT NULL,
  `company_name` varchar(150) DEFAULT NULL,
  `supply_crops_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`user_id`, `company_name`, `supply_crops_type`) VALUES
(6, 'AgriSupply Ltd.', 'Fertilizer & Seeds');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_type` enum('F','S','WM','PM','QI','A','MO','LM') NOT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password`, `role_type`, `status`, `created_at`) VALUES
(1, 'Admin', 'User', 'admin@agrichain.com', '$2b$10$8cb5VhxV3uTJg4hAbAkLM.LNn4nc4iJT8oF1gWc8NkUen1vEePM2y', 'A', 'Active', '2026-04-11 11:20:45'),
(4, 'Rahim', 'Uddin', 'rahim@agrichain.com', '$2b$10$h5VuNvjDYaW2edfNwLywCe3tAANBHLayIC2ZlCfeXQXgonrcCCmAy', 'F', 'Active', '2026-04-11 12:02:28'),
(5, 'Karim', 'Ali', 'karim@agrichain.com', '$2b$10$h5VuNvjDYaW2edfNwLywCe3tAANBHLayIC2ZlCfeXQXgonrcCCmAy', 'F', 'Active', '2026-04-11 12:02:28'),
(6, 'Bashir', 'Ahmed', 'bashir@agrichain.com', '$2b$10$h5VuNvjDYaW2edfNwLywCe3tAANBHLayIC2ZlCfeXQXgonrcCCmAy', 'S', 'Active', '2026-04-11 12:02:28'),
(7, 'Nasreen', 'Akter', 'nasreen@agrichain.com', '$2b$10$h5VuNvjDYaW2edfNwLywCe3tAANBHLayIC2ZlCfeXQXgonrcCCmAy', 'WM', 'Active', '2026-04-11 12:02:28'),
(8, 'Rafique', 'Islam', 'rafique@agrichain.com', '$2b$10$h5VuNvjDYaW2edfNwLywCe3tAANBHLayIC2ZlCfeXQXgonrcCCmAy', 'PM', 'Active', '2026-04-11 12:02:28'),
(9, 'Salma', 'Khatun', 'salma@agrichain.com', '$2b$10$h5VuNvjDYaW2edfNwLywCe3tAANBHLayIC2ZlCfeXQXgonrcCCmAy', 'QI', 'Active', '2026-04-11 12:02:28'),
(10, 'Jahangir', 'Alam', 'jahangir@agrichain.com', '$2b$10$h5VuNvjDYaW2edfNwLywCe3tAANBHLayIC2ZlCfeXQXgonrcCCmAy', 'MO', 'Active', '2026-04-11 12:02:28'),
(11, 'Mosharraf', 'Khan', 'mosharraf@agrichain.com', '$2b$10$h5VuNvjDYaW2edfNwLywCe3tAANBHLayIC2ZlCfeXQXgonrcCCmAy', 'LM', 'Active', '2026-04-11 12:02:28'),
(12, 'farme', '1', 'farmer@c.c', '$2b$10$BtJWRjTe71ObIjE01YWFSOXAqtjqRkSsVJyaaiszlqrBloLgHFPC6', 'F', 'Active', '2026-04-11 12:12:28'),
(13, 'admin', '1', 'admin@c.c', '$2b$10$vYj.KYByfGyNhGAqZvJ.KujXDHH.ssyFI4mEZrSom2ViYYdtZqjmG', 'A', 'Active', '2026-04-11 12:22:29'),
(14, 'Test', '1', 'test@test.com', '$2b$10$PeoBj60C2Yauy9I.JqMQ.u4vYQFF.u0VXIDyjdzEIJZ/vUHo3teBq', 'A', 'Active', '2026-04-11 13:11:18'),
(15, 'farmer', '1', 'f@test.com', '$2b$10$8q7WaXZHBpNWfSboKBR/cek3Kc7QrhwqV4n4oBzHdxWdTJr.5/4NC', 'F', 'Active', '2026-04-11 13:15:36'),
(16, 'warehouse', '1', 'warehouse@test.com', '$2b$10$YZWfWvXRK9Dmv1L1dVbbIuaoltbFRx6DlF/81WpVGP7iKqF4o9dgm', 'WM', 'Active', '2026-04-11 13:16:41'),
(17, 'processing', '1', 'processing@test.com', '$2b$10$fmqZ0K1oQnhJi1keMJN5dua4zLbV7YkSxWA6ZBfjMLHYYhbLRiNK6', 'PM', 'Active', '2026-04-11 13:17:28'),
(18, 'quality', '1', 'quality@test.com', '$2b$10$CkInZguKllyt0bk1szQCVuIdJk2yuUIPAf2TwFFx973EGYbHy8LhK', 'QI', 'Active', '2026-04-11 13:18:18'),
(19, 'market', '1', 'market@test.com', '$2b$10$Y2cltsZBRUML6Bd/O3Hr0ugLy.8LjtSQ.PAYgDN49zkwb7ltl/5Sa', 'MO', 'Active', '2026-04-11 13:19:02'),
(20, 'logistics', '1', 'logistics@test.com', '$2b$10$Fli8049sYarSglXZvIo6qebjPTmMuK1Dk9MQijpzRen2OphPBQ7S2', 'LM', 'Active', '2026-04-11 13:19:39');

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE `warehouse` (
  `warehouse_id` int(11) NOT NULL,
  `area` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `capacity` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `warehouse`
--

INSERT INTO `warehouse` (`warehouse_id`, `area`, `district`, `capacity`) VALUES
(1, 'Tongi Industrial Area', 'Dhaka', 5000.00),
(2, 'Agrabad Commercial Area', 'Chittagong', 3000.00),
(3, 'Sunamganj Town Centre', 'Sylhet', 2000.00);

-- --------------------------------------------------------

--
-- Table structure for table `warehouse_managers`
--

CREATE TABLE `warehouse_managers` (
  `user_id` int(11) NOT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `warehouse_district` varchar(100) DEFAULT NULL,
  `warehouse_area` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `warehouse_managers`
--

INSERT INTO `warehouse_managers` (`user_id`, `warehouse_id`, `warehouse_district`, `warehouse_area`) VALUES
(7, NULL, 'Dhaka', 'Tongi'),
(16, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `delivery`
--
ALTER TABLE `delivery`
  ADD PRIMARY KEY (`delivery_id`),
  ADD KEY `batch_id` (`batch_id`),
  ADD KEY `market_id` (`market_id`),
  ADD KEY `logistics_manager_id` (`logistics_manager_id`);

--
-- Indexes for table `farmers`
--
ALTER TABLE `farmers`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `harvest_batch`
--
ALTER TABLE `harvest_batch`
  ADD PRIMARY KEY (`batch_id`),
  ADD KEY `farmer_id` (`farmer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `input_supply`
--
ALTER TABLE `input_supply`
  ADD PRIMARY KEY (`supply_id`),
  ADD KEY `farmer_id` (`farmer_id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD KEY `batch_id` (`batch_id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- Indexes for table `logistics_managers`
--
ALTER TABLE `logistics_managers`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `market`
--
ALTER TABLE `market`
  ADD PRIMARY KEY (`market_id`),
  ADD KEY `operator_id` (`operator_id`);

--
-- Indexes for table `market_operators`
--
ALTER TABLE `market_operators`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `processing_batch`
--
ALTER TABLE `processing_batch`
  ADD PRIMARY KEY (`processing_id`),
  ADD KEY `batch_id` (`batch_id`),
  ADD KEY `plant_id` (`plant_id`);

--
-- Indexes for table `processing_managers`
--
ALTER TABLE `processing_managers`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `processing_plant`
--
ALTER TABLE `processing_plant`
  ADD PRIMARY KEY (`plant_id`),
  ADD KEY `manager_id` (`manager_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `quality_inspectors`
--
ALTER TABLE `quality_inspectors`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `quality_report`
--
ALTER TABLE `quality_report`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `processing_id` (`processing_id`),
  ADD KEY `inspector_id` (`inspector_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`sale_id`),
  ADD KEY `batch_id` (`batch_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `market_id` (`market_id`);

--
-- Indexes for table `sensor`
--
ALTER TABLE `sensor`
  ADD PRIMARY KEY (`sensor_id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- Indexes for table `sensor_data`
--
ALTER TABLE `sensor_data`
  ADD PRIMARY KEY (`data_id`),
  ADD KEY `sensor_id` (`sensor_id`);

--
-- Indexes for table `sowing_logs`
--
ALTER TABLE `sowing_logs`
  ADD PRIMARY KEY (`sowing_id`),
  ADD KEY `farmer_id` (`farmer_id`);

--
-- Indexes for table `stock_movement`
--
ALTER TABLE `stock_movement`
  ADD PRIMARY KEY (`movement_id`),
  ADD KEY `batch_id` (`batch_id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`warehouse_id`);

--
-- Indexes for table `warehouse_managers`
--
ALTER TABLE `warehouse_managers`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `fk_wm_warehouse` (`warehouse_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `delivery`
--
ALTER TABLE `delivery`
  MODIFY `delivery_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `harvest_batch`
--
ALTER TABLE `harvest_batch`
  MODIFY `batch_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `input_supply`
--
ALTER TABLE `input_supply`
  MODIFY `supply_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `market`
--
ALTER TABLE `market`
  MODIFY `market_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `processing_batch`
--
ALTER TABLE `processing_batch`
  MODIFY `processing_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `processing_plant`
--
ALTER TABLE `processing_plant`
  MODIFY `plant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `quality_report`
--
ALTER TABLE `quality_report`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `sale_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sensor`
--
ALTER TABLE `sensor`
  MODIFY `sensor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sensor_data`
--
ALTER TABLE `sensor_data`
  MODIFY `data_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sowing_logs`
--
ALTER TABLE `sowing_logs`
  MODIFY `sowing_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `stock_movement`
--
ALTER TABLE `stock_movement`
  MODIFY `movement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `warehouse`
--
ALTER TABLE `warehouse`
  MODIFY `warehouse_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `delivery`
--
ALTER TABLE `delivery`
  ADD CONSTRAINT `delivery_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `harvest_batch` (`batch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `delivery_ibfk_2` FOREIGN KEY (`market_id`) REFERENCES `market` (`market_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `delivery_ibfk_3` FOREIGN KEY (`logistics_manager_id`) REFERENCES `logistics_managers` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `farmers`
--
ALTER TABLE `farmers`
  ADD CONSTRAINT `farmers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `harvest_batch`
--
ALTER TABLE `harvest_batch`
  ADD CONSTRAINT `harvest_batch_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `harvest_batch_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `input_supply`
--
ALTER TABLE `input_supply`
  ADD CONSTRAINT `input_supply_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `input_supply_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `harvest_batch` (`batch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`warehouse_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `logistics_managers`
--
ALTER TABLE `logistics_managers`
  ADD CONSTRAINT `logistics_managers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `market`
--
ALTER TABLE `market`
  ADD CONSTRAINT `market_ibfk_1` FOREIGN KEY (`operator_id`) REFERENCES `market_operators` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `market_operators`
--
ALTER TABLE `market_operators`
  ADD CONSTRAINT `market_operators_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `processing_batch`
--
ALTER TABLE `processing_batch`
  ADD CONSTRAINT `processing_batch_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `harvest_batch` (`batch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `processing_batch_ibfk_2` FOREIGN KEY (`plant_id`) REFERENCES `processing_plant` (`plant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `processing_managers`
--
ALTER TABLE `processing_managers`
  ADD CONSTRAINT `processing_managers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `processing_plant`
--
ALTER TABLE `processing_plant`
  ADD CONSTRAINT `processing_plant_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `processing_managers` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quality_inspectors`
--
ALTER TABLE `quality_inspectors`
  ADD CONSTRAINT `quality_inspectors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quality_report`
--
ALTER TABLE `quality_report`
  ADD CONSTRAINT `quality_report_ibfk_1` FOREIGN KEY (`processing_id`) REFERENCES `processing_batch` (`processing_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quality_report_ibfk_2` FOREIGN KEY (`inspector_id`) REFERENCES `quality_inspectors` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `harvest_batch` (`batch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sales_ibfk_3` FOREIGN KEY (`market_id`) REFERENCES `market` (`market_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sensor`
--
ALTER TABLE `sensor`
  ADD CONSTRAINT `sensor_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`warehouse_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sensor_data`
--
ALTER TABLE `sensor_data`
  ADD CONSTRAINT `sensor_data_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensor` (`sensor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sowing_logs`
--
ALTER TABLE `sowing_logs`
  ADD CONSTRAINT `sowing_logs_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stock_movement`
--
ALTER TABLE `stock_movement`
  ADD CONSTRAINT `stock_movement_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `harvest_batch` (`batch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_movement_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`warehouse_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD CONSTRAINT `suppliers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `warehouse_managers`
--
ALTER TABLE `warehouse_managers`
  ADD CONSTRAINT `fk_wm_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`warehouse_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `warehouse_managers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
