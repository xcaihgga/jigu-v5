-- =====================================================
-- 肌骨康复临床路径数据库 - 完整建库建表脚本
-- 数据库版本: MySQL 8.0+
-- 字符集: utf8mb4
-- 存储引擎: InnoDB
-- =====================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS ms_rehab_pathways
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE ms_rehab_pathways;

-- =====================================================
-- 1. 路径主表（path_main）
-- 存储所有临床康复路径的元数据
-- =====================================================
CREATE TABLE IF NOT EXISTS path_main (
    path_id         VARCHAR(20)     NOT NULL COMMENT '路径ID，主键，如CP-MS-001',
    path_name       VARCHAR(200)    NOT NULL COMMENT '路径名称',
    icd_code        VARCHAR(20)     NOT NULL COMMENT 'ICD-10疾病编码',
    path_type       VARCHAR(20)     NOT NULL COMMENT '路径类型：保守/术后/围手术期',
    body_region     VARCHAR(20)     NOT NULL COMMENT '身体部位：脊柱/肩/肘/腕手/髋/膝/踝足/全身',
    total_stages    INT             NOT NULL DEFAULT 3 COMMENT '总阶段数',
    guideline_source TEXT           NULL COMMENT '指南依据来源',
    version         VARCHAR(20)     NOT NULL COMMENT '版本号，如V2024.1',
    is_active       TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '是否启用：1启用，0停用',
    create_time     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (path_id),
    INDEX idx_body_region (body_region),
    INDEX idx_path_type (path_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路径主表——存储所有肌骨康复临床路径的元数据';

-- =====================================================
-- 2. 阶段定义表（stage_definition）
-- 每个路径按时间轴划分的治疗阶段
-- =====================================================
CREATE TABLE IF NOT EXISTS stage_definition (
    stage_id        VARCHAR(30)     NOT NULL COMMENT '阶段ID，主键',
    path_id         VARCHAR(20)     NOT NULL COMMENT '外键→路径主表',
    stage_no        INT             NOT NULL COMMENT '阶段序号，从1开始',
    stage_name      VARCHAR(100)    NOT NULL COMMENT '阶段名称',
    time_window     VARCHAR(100)    NOT NULL COMMENT '时间窗描述，如术后0-2周',
    stage_goal      TEXT            NULL COMMENT '阶段核心目标',
    create_time     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (stage_id),
    INDEX idx_path_id (path_id),
    UNIQUE KEY uk_path_stage (path_id, stage_no),
    CONSTRAINT fk_stage_path FOREIGN KEY (path_id) REFERENCES path_main(path_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='阶段定义表——每个路径按时间轴划分的治疗阶段';

-- =====================================================
-- 3. 干预活动表（intervention_activity）
-- 每个阶段内的具体诊疗/康复活动
-- =====================================================
CREATE TABLE IF NOT EXISTS intervention_activity (
    activity_id     VARCHAR(30)     NOT NULL COMMENT '活动ID，主键',
    stage_id        VARCHAR(30)     NOT NULL COMMENT '外键→阶段定义表',
    activity_name   VARCHAR(200)    NOT NULL COMMENT '活动名称',
    activity_type   VARCHAR(30)     NOT NULL COMMENT '活动类型：检查/治疗/评定/护理/教育',
    performer_role  VARCHAR(50)     NOT NULL COMMENT '执行角色：康复医师/治疗师/护士/患者自主',
    frequency       VARCHAR(100)    NULL COMMENT '执行频率，如每日2次',
    duration_min    INT             NULL COMMENT '单次时长（分钟）',
    is_mandatory    TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '是否必选项：1必选，0可选',
    pinyin_code     VARCHAR(20)     NULL COMMENT '拼音助记码，用于快速检索',
    create_time     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (activity_id),
    INDEX idx_stage_id (stage_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_performer_role (performer_role),
    CONSTRAINT fk_activity_stage FOREIGN KEY (stage_id) REFERENCES stage_definition(stage_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='干预活动表——每个阶段内的具体诊疗/康复活动';

-- =====================================================
-- 4. 评定节点表（evaluation_node）
-- 路径中必须完成的评估节点
-- =====================================================
CREATE TABLE IF NOT EXISTS evaluation_node (
    eval_id         VARCHAR(30)     NOT NULL COMMENT '评定ID，主键',
    path_id         VARCHAR(20)     NOT NULL COMMENT '外键→路径主表',
    eval_name       VARCHAR(200)    NOT NULL COMMENT '评定名称',
    eval_tool       VARCHAR(200)    NULL COMMENT '评定工具/量表名称',
    eval_timepoint  VARCHAR(50)     NOT NULL COMMENT '评定时机：入院/阶段转换/出院/随访',
    eval_type       VARCHAR(20)     NOT NULL COMMENT '评定类型：功能/疼痛/心理/综合/影像',
    performer_role  VARCHAR(50)     NULL COMMENT '执行角色',
    is_mandatory    TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '是否必评：1必评，0可选',
    create_time     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (eval_id),
    INDEX idx_path_id (path_id),
    INDEX idx_eval_timepoint (eval_timepoint),
    CONSTRAINT fk_eval_path FOREIGN KEY (path_id) REFERENCES path_main(path_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评定节点表——路径中必须完成的评估节点';

-- =====================================================
-- 5. 变异记录表（variation_record）
-- 患者偏离路径的变异事件记录
-- =====================================================
CREATE TABLE IF NOT EXISTS variation_record (
    variation_id        VARCHAR(30)     NOT NULL COMMENT '变异ID，主键',
    instance_id         VARCHAR(30)     NOT NULL COMMENT '关联路径实例ID',
    variation_type      VARCHAR(20)     NOT NULL COMMENT '变异类型：正性/负性',
    variation_category  VARCHAR(30)     NOT NULL COMMENT '变异分类：患者因素/医疗因素/系统因素',
    variation_reason    TEXT            NULL COMMENT '变异原因描述',
    management_action   TEXT            NULL COMMENT '处理措施',
    is_path_exit        TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '是否退出路径：1退出，0未退出',
    recording_time      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
    recorder_id         VARCHAR(20)     NULL COMMENT '记录人ID',
    PRIMARY KEY (variation_id),
    INDEX idx_instance_id (instance_id),
    INDEX idx_variation_type (variation_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='变异记录表——患者偏离路径的变异事件记录';

-- =====================================================
-- 6. 路径实例表（path_instance）
-- 患者实际执行路径的记录
-- =====================================================
CREATE TABLE IF NOT EXISTS path_instance (
    instance_id             VARCHAR(30)     NOT NULL COMMENT '实例ID，主键',
    patient_id              VARCHAR(20)     NOT NULL COMMENT '患者ID',
    path_id                 VARCHAR(20)     NOT NULL COMMENT '外键→路径主表',
    path_version            VARCHAR(20)     NOT NULL COMMENT '路径版本号，记录当时使用的版本',
    entry_date              DATETIME        NOT NULL COMMENT '入径时间',
    entry_stage_no          INT             NOT NULL DEFAULT 1 COMMENT '入径阶段序号',
    current_stage_no        INT             NOT NULL DEFAULT 1 COMMENT '当前阶段序号',
    phase_transition_dates  JSON            NULL COMMENT '各阶段转换日期，JSON格式存储',
    exit_date               DATETIME        NULL COMMENT '出径时间',
    exit_reason             VARCHAR(50)     NULL COMMENT '出径原因：完成/变异退出/死亡/转科',
    total_variations        INT             NOT NULL DEFAULT 0 COMMENT '累计变异次数',
    is_closed               TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '是否已关闭：1关闭，0进行中',
    create_time             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (instance_id),
    INDEX idx_patient_id (patient_id),
    INDEX idx_path_id (path_id),
    INDEX idx_is_closed (is_closed),
    CONSTRAINT fk_instance_path FOREIGN KEY (path_id) REFERENCES path_main(path_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路径实例表——患者实际执行路径的记录';

-- =====================================================
-- 7. 路径执行记录表（execution_record）
-- 核心行为数据表，记录患者每天/每次的执行情况
-- =====================================================
CREATE TABLE IF NOT EXISTS execution_record (
    execution_id        BIGINT          NOT NULL AUTO_INCREMENT COMMENT '执行记录ID，主键自增',
    instance_id         VARCHAR(30)     NOT NULL COMMENT '外键→路径实例表',
    activity_id         VARCHAR(30)     NOT NULL COMMENT '外键→干预活动表',
    planned_date        DATE            NULL COMMENT '计划执行日期',
    actual_date         DATETIME        NULL COMMENT '实际执行时间',
    execution_status    VARCHAR(10)     NOT NULL DEFAULT 'pending' COMMENT '执行状态：completed/未完成/部分完成/cancelled/pending',
    performer_id        VARCHAR(20)     NULL COMMENT '执行人ID',
    patient_response    TEXT            NULL COMMENT '患者反应：疼痛评分/耐受性/不适描述',
    clinical_notes      TEXT            NULL COMMENT '治疗师备注',
    pain_before         TINYINT         NULL COMMENT '治疗前疼痛评分(0-10)',
    pain_after          TINYINT         NULL COMMENT '治疗后疼痛评分(0-10)',
    is_variation        TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '是否触发变异',
    variation_id        VARCHAR(30)     NULL COMMENT '关联变异记录ID',
    hospital_day        INT             NULL COMMENT '住院天数（方便统计）',
    create_time         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (execution_id),
    INDEX idx_instance_id (instance_id),
    INDEX idx_activity_id (activity_id),
    INDEX idx_execution_status (execution_status),
    INDEX idx_planned_date (planned_date),
    INDEX idx_actual_date (actual_date),
    CONSTRAINT fk_exec_instance FOREIGN KEY (instance_id) REFERENCES path_instance(instance_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_exec_activity FOREIGN KEY (activity_id) REFERENCES intervention_activity(activity_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路径执行记录表——核心行为数据表，记录患者每天/每次的执行情况';
